# import asyncio
# import json
# import uuid
# from datetime import datetime
# from typing import Dict, Any, Optional
# from contextlib import asynccontextmanager

# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import uvicorn
# import traceback
# from graph.workflow import debate_graph
# from graph.state import DebateState, DebateMessage, ResearchBrief, JudgeDecision, FinalReport
# from config.settings import settings
# from utils.helpers import DebateMetrics

# # Connection Manager for WebSocket handling
# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: Dict[str, WebSocket] = {}
#         self.session_metrics: Dict[str, DebateMetrics] = {}
    
#     async def connect(self, websocket: WebSocket, session_id: str):
#         await websocket.accept()
#         self.active_connections[session_id] = websocket
#         self.session_metrics[session_id] = DebateMetrics()
#         print(f"✓ Session {session_id} connected")
    
#     def disconnect(self, session_id: str):
#         if session_id in self.active_connections:
#             del self.active_connections[session_id]
#         if session_id in self.session_metrics:
#             metrics = self.session_metrics.pop(session_id, None)
#             if metrics and metrics.start_time:
#                 print(f"✓ Session {session_id} completed in {metrics.get_total_duration():.2f}s")
    
#     async def send_message(self, session_id: str, message: Dict[str, Any]):
#         if session_id in self.active_connections:
#             try:
#                 websocket = self.active_connections[session_id]
#                 await websocket.send_text(json.dumps(message, default=str))
#                 return True
#             except Exception:
#                 self.disconnect(session_id)
#                 return False
#         return False

# # Global connection manager
# manager = ConnectionManager()

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     print("🚀 Starting Project Chimera Backend...")
#     yield
#     print("🛑 Shutting down Project Chimera Backend...")

# # Initialize FastAPI app
# app = FastAPI(
#     title="Project Chimera API",
#     description="Multi-Agent Expert Debate System",
#     version="1.0.0",
#     lifespan=lifespan
# )

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], # More permissive for development
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

# # API Routes
# @app.get("/")
# async def root():
#     return {"message": "Project Chimera - Multi-Agent Debate System"}

# @app.websocket("/debate/{session_id}")
# async def websocket_endpoint(websocket: WebSocket, session_id: str):
#     await manager.connect(websocket, session_id)
    
#     try:
#         while True:
#             data = await websocket.receive_text()
#             message = json.loads(data)
            
#             if message.get("type") == "start_debate":
#                 query = message.get("query", "").strip()
#                 if not query:
#                     await manager.send_message(session_id, {"type": "error", "message": "Query cannot be empty"})
#                     continue
                
#                 # Run the debate workflow as a background task
#                 asyncio.create_task(run_debate_workflow(session_id, query))
                
#     except WebSocketDisconnect:
#         print(f"Client disconnected: {session_id}")
#         manager.disconnect(session_id)
#     except Exception as e:
#         print(f"WebSocket error for {session_id}: {e}")
#         await manager.send_message(session_id, {"type": "error", "message": f"An error occurred: {str(e)}"})
#         manager.disconnect(session_id)

# async def run_debate_workflow(session_id: str, query: str):
#     """Execute the complete debate workflow with real-time updates."""
    
#     if session_id not in manager.session_metrics: return
    
#     metrics = manager.session_metrics[session_id]
#     metrics.start_debate()
    
#     try:
#         initial_state = DebateState(
#             user_query=query,
#             messages=[],
#             round_count=0,
#             status="initialized"
#         )
        
#         config = {"configurable": {"thread_id": session_id}}
        
#         # Track timestamps of messages already sent to the client
#         sent_message_timestamps = set()

#         async for event in debate_graph.astream(initial_state, config):
#             if session_id not in manager.active_connections: break
                
#             node_name = list(event.keys())[0]
#             state_update = event[node_name]
            
#             await handle_workflow_update(session_id, node_name, state_update, sent_message_timestamps)
        
#         metrics.end_debate()
#         await manager.send_message(session_id, {
#             "type": "debate_complete",
#             "data": {"total_duration": metrics.get_total_duration()}
#         })
        
#     except Exception as e:
#         print(f"Workflow error for {session_id}: {e}")
#         traceback.print_exc()
#         await manager.send_message(session_id, {"type": "error", "message": f"Debate workflow failed: {str(e)}"})

# async def handle_workflow_update(session_id: str, node_name: str, state: Dict[str, Any], sent_timestamps: set):
#     """Handle updates from different workflow nodes and send to client."""
    
#     # Send any new agent messages that haven't been sent yet
#     if messages := state.get("messages"):
#         for msg_obj in messages:
#             ts = msg_obj.timestamp
#             if ts not in sent_timestamps:
#                 await manager.send_message(session_id, {
#                     "type": "agent_response",
#                     "data": msg_obj.dict()
#                 })
#                 sent_timestamps.add(ts)

#     # Handle specific node completion events based on the status flag
#     status = state.get("status", "")
#     if status == "research_complete":
#         brief = state.get("research_brief")
#         await manager.send_message(session_id, {
#             "type": "research_complete",
#             "data": {"brief": brief.dict() if isinstance(brief, ResearchBrief) else brief}
#         })
#     elif status == "judge_decision_complete":
#         decision = state.get("judge_decision")
#         if decision:
#             await manager.send_message(session_id, {
#                 "type": "judge_decision",
#                 "data": {
#                     # FIX: Use attribute access for Pydantic objects
#                     "should_continue": decision.should_continue,
#                     "reasoning": decision.reasoning,
#                     "round_count": state.get("round_count")
#                 }
#             })
#     elif status == "complete":
#         report = state.get("final_report")
#         await manager.send_message(session_id, {
#             "type": "final_report",
#             "data": report.dict() if isinstance(report, FinalReport) else report
#         })

# if __name__ == "__main__":
#     uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)


import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import traceback
from graph.workflow import debate_graph
from graph.state import DebateState, DebateMessage, ResearchBrief, JudgeDecision, FinalReport
from config.settings import settings
from utils.helpers import DebateMetrics

# Connection Manager for WebSocket handling
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.session_metrics: Dict[str, DebateMetrics] = {}
    
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        self.session_metrics[session_id] = DebateMetrics()
        print(f"✅ Session {session_id} connected")
    
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
        if session_id in self.session_metrics:
            metrics = self.session_metrics.pop(session_id, None)
            if metrics and metrics.start_time:
                print(f"✅ Session {session_id} completed in {metrics.get_total_duration():.2f}s")
    
    async def send_message(self, session_id: str, message: Dict[str, Any]):
        if session_id in self.active_connections:
            try:
                websocket = self.active_connections[session_id]
                await websocket.send_text(json.dumps(message, default=str))
                return True
            except Exception:
                self.disconnect(session_id)
                return False
        return False

# Global connection manager
manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting Project Chimera Backend...")
    yield
    print("🛑 Shutting down Project Chimera Backend...")

# Initialize FastAPI app
app = FastAPI(
    title="Project Chimera API",
    description="Multi-Agent Expert Debate System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# API Routes
@app.get("/")
async def root():
    return {"message": "Project Chimera - Multi-Agent Debate System"}

@app.websocket("/debate/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "start_debate":
                query = message.get("query", "").strip()
                if not query:
                    await manager.send_message(session_id, {"type": "error", "message": "Query cannot be empty"})
                    continue
                
                # Run the debate workflow as a background task
                asyncio.create_task(run_debate_workflow(session_id, query))
                
    except WebSocketDisconnect:
        print(f"Client disconnected: {session_id}")
        manager.disconnect(session_id)
    except Exception as e:
        print(f"WebSocket error for {session_id}: {e}")
        await manager.send_message(session_id, {"type": "error", "message": f"An error occurred: {str(e)}"})
        manager.disconnect(session_id)

async def run_debate_workflow(session_id: str, query: str):
    """Execute the complete debate workflow with real-time updates."""
    
    if session_id not in manager.session_metrics: return
    
    metrics = manager.session_metrics[session_id]
    metrics.start_debate()
    
    try:
        initial_state = DebateState(
            user_query=query,
            messages=[],
            round_count=0,
            status="initialized"
        )
        
        config = {"configurable": {"thread_id": session_id}}
        
        # Track timestamps of messages already sent to the client
        sent_message_timestamps = set()

        async for event in debate_graph.astream(initial_state, config):
            if session_id not in manager.active_connections: break
                
            node_name = list(event.keys())[0]
            state_update = event[node_name]
            
            await handle_workflow_update(session_id, node_name, state_update, sent_message_timestamps)
        
        metrics.end_debate()
        await manager.send_message(session_id, {
            "type": "debate_complete",
            "data": {"total_duration": metrics.get_total_duration()}
        })
        
    except Exception as e:
        print(f"Workflow error for {session_id}: {e}")
        traceback.print_exc()
        await manager.send_message(session_id, {"type": "error", "message": f"Debate workflow failed: {str(e)}"})

async def handle_workflow_update(session_id: str, node_name: str, state: Dict[str, Any], sent_timestamps: set):
    """Handle updates from different workflow nodes and send to client."""
    
    # Send any new agent messages that haven't been sent yet
    if messages := state.get("messages"):
        for msg_obj in messages:
            ts = msg_obj.timestamp
            if ts not in sent_timestamps:
                await manager.send_message(session_id, {
                    "type": "agent_response",
                    "data": msg_obj.dict()
                })
                sent_timestamps.add(ts)

    # Handle specific node completion events based on the status flag
    status = state.get("status", "")
    
    # Handle new hybrid model statuses
    if status == "research_complete":
        brief = state.get("research_brief")
        await manager.send_message(session_id, {
            "type": "research_complete",
            "data": {"brief": brief.dict() if isinstance(brief, ResearchBrief) else brief}
        })
    elif status.startswith("debating_round_1_parallel"):
        # Round 1 parallel execution status
        round_count = state.get("round_count", 1)
        await manager.send_message(session_id, {
            "type": "round_start",
            "data": {
                "round": round_count,
                "type": "parallel",
                "message": f"Round {round_count} - All experts presenting opening statements simultaneously"
            }
        })
    elif status.startswith("debating_round_") and "sequential" in status:
        # Round 2+ sequential execution status
        round_count = state.get("round_count", 1)
        await manager.send_message(session_id, {
            "type": "round_start", 
            "data": {
                "round": round_count,
                "type": "sequential", 
                "message": f"Round {round_count} - Expert rebuttals and counter-arguments"
            }
        })
    elif status == "judge_decision_complete":
        decision = state.get("judge_decision")
        if decision:
            await manager.send_message(session_id, {
                "type": "judge_decision",
                "data": {
                    "should_continue": decision.should_continue,
                    "reasoning": decision.reasoning,
                    "round_count": state.get("round_count"),
                    "targeted_prompts": decision.targeted_prompts
                }
            })
    elif status == "complete":
        report = state.get("final_report")
        await manager.send_message(session_id, {
            "type": "final_report",
            "data": report.dict() if isinstance(report, FinalReport) else report
        })
    
    # Handle node-specific events for better UI feedback
    if node_name == "parallel_opening":
        await manager.send_message(session_id, {
            "type": "node_update",
            "data": {
                "node": "parallel_opening",
                "message": "All experts formulating independent opening statements..."
            }
        })
    elif node_name == "sequential_rebuttal":
        await manager.send_message(session_id, {
            "type": "node_update", 
            "data": {
                "node": "sequential_rebuttal",
                "message": "Experts engaging in sequential debate rebuttals..."
            }
        })
    elif node_name == "judge":
        await manager.send_message(session_id, {
            "type": "node_update",
            "data": {
                "node": "judge",
                "message": "AI judge evaluating debate quality and direction..."
            }
        })

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)