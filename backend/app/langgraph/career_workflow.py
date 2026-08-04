from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from app.services.ai_service import AIService


class CareerWorkflowState(TypedDict, total=False):
    inputs: dict[str, Any]
    snapshot: dict[str, Any]


async def analyze_career(state: CareerWorkflowState) -> CareerWorkflowState:
    service = AIService()
    snapshot = await service.career_snapshot(state["inputs"])
    return {"inputs": state["inputs"], "snapshot": snapshot}


def build_career_workflow():
    graph = StateGraph(CareerWorkflowState)
    graph.add_node("analyze_career", analyze_career)
    graph.set_entry_point("analyze_career")
    graph.add_edge("analyze_career", END)
    return graph.compile()
