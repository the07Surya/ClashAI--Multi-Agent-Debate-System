from duckduckgo_search import DDGS
import pprint

results = DDGS().text("Gen Z people are better than millennials", max_results=5, region="us-en")
pprint.pprint(results)