from worlds.AutoWorld import World
from BaseClasses import Item, Region
from .Items import Click2Item, item_data_table, item_table
from .Locations import Click2Location, location_data_table, location_table
from .Regions import region_data_table
# from .Options import Clique2Options
from .Options import click2_options
from typing import Any, List, Mapping
from worlds.generic.Rules import set_rule


class Click2World(World):
    """The second greatest game of all time."""

    game = "Click 2"
    data_version = 3
    # options_dataclass = Clique2Options()
    # options: Clique2Options
    option_definitions = click2_options
    location_name_to_id = location_table
    item_name_to_id = item_table

    def create_item(self, name: str) -> Item:
        return Click2Item(name, item_data_table[name].type, item_data_table[name].code, self.player)

    def create_items(self) -> None:
        item_pool: List[Click2Item] = []
        for name, item in item_data_table.items():
            if item.code:
                item_pool.append(self.create_item(name))

        self.multiworld.itempool += item_pool

    def create_regions(self) -> None:
        for region_name in region_data_table.keys():
            region = Region(region_name, self.player, self.multiworld)
            self.multiworld.regions.append(region)

        for region_name, region_data in region_data_table.items():
            region = self.multiworld.get_region(region_name, self.player)
            region.add_locations({
                location_name: location_data.address for location_name, location_data in location_data_table.items()
                if location_data.region == region_name
            })
            region.add_exits(region_data_table[region_name].connecting_regions)

    def set_rules(self) -> None:
        set_rule(self.multiworld.get_location(
            "Click Master", self.player), lambda state: True)

    def fill_slot_data(self) -> Mapping[str, Any]:
        return {
            "clicks_to_win": self.options.clicks_to_win.value,
            "clicks_per_check": self.options.clicks_per_check.value,
            "button_color": self.options.button_color.value,
        }
