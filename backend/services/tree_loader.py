import json
import os
from functools import lru_cache
from typing import Any

TREE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "career_tree.json")


@lru_cache(maxsize=1)
def load_career_tree() -> dict[str, Any]:
    with open(TREE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_stream_names() -> list[str]:
    return list(load_career_tree().keys())


def get_substreams(stream: str) -> list[dict]:
    tree = load_career_tree()
    entry = tree.get(stream, {})
    return entry.get("substreams", [])
