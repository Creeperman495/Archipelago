from BaseClasses import Item, ItemClassification
from typing import NamedTuple, Optional, Dict


class Click2Item(Item):
    game = "Clique 2"


class Click2ItemData(NamedTuple):
    code: Optional[int] = None
    type: ItemClassification = ItemClassification.filler


item_data_table: Dict[str, Click2ItemData] = {
    "Feeling of Satisfaction 2": Click2ItemData(
        code=495000,
        type=ItemClassification.progression
    ),
}

item_table = {name: data.code for name,
              data in item_data_table.items() if data.code is not None}
