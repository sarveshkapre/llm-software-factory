from llm_software_factory.main import main


def test_main_returns_success() -> None:
    assert main() == 0
