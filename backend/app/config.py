from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "S2B AI Voice Agent"
    frontend_origin: str = "http://localhost:5173"
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    database_path: str = "voice_agent.db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
