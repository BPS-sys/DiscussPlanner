from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Union
import uvicorn

app = FastAPI()


class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Union[float, None] = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Foo",
                    "description": "A very nice Item",
                    "price": 35.4,
                    "tax": 3.2,
                }
            ]
        }
    }


@app.get("/")
async def status():
    return "OK"


@app.post("/items/")
async def create_item(item: Item):
    results = {
        "item": {
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "tax": item.tax,
        },
    }
    return results


if __name__ == "__main__":
    uvicorn.run("Q1_fastAPI:app", host="127.0.0.1", port=3000, reload=True)
