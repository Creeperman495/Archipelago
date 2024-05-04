from BaseClasses import Location, MultiWorld
from typing import NamedTuple, Optional, Dict


class Click2Location(Location):
    game = "Clique 2"


class Click2LocationData(NamedTuple):
    region: str
    address: Optional[int] = None


location_data_table: Dict[str, Click2LocationData] = {
    "Click Master": Click2LocationData(
        region="The Button Realm",
        address=495000
    ),
}

location_table = {name: data.address for name,
                  data in location_data_table.items() if data.address is not None}
