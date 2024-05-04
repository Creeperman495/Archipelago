from typing import Dict, List, NamedTuple


class Click2RegionData(NamedTuple):
    connecting_regions: List[str] = []


region_data_table: Dict[str, Click2RegionData] = {
    "Menu": Click2RegionData(["The Button Realm"]),
    "The Button Realm": Click2RegionData(),
}
