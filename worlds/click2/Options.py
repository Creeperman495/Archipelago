from Options import Range, Choice, PerGameCommonOptions, Option
from typing import Dict, Type
from dataclasses import dataclass


class ClicksToWin(Range):
    """Number of clicks needed to reach your goal."""
    display_name = "Clicks to Win"
    range_start = 1
    range_end = 100
    default = 10


class ClicksPerCheck(Range):
    """Send a check every X clicks. The final click will always send out a check,
    even if according to this setting it shouldn't. 0 to disable extra checks."""
    display_name = "Clicks Per Check"
    range_start = 0
    range_end = 10
    default = 1


class ButtonColor(Choice):
    """Customize your button! Now available in 12 unique colors."""
    display_name = "Button Color"
    option_red = 0
    option_orange = 1
    option_yellow = 2
    option_green = 3
    option_cyan = 4
    option_blue = 5
    option_magenta = 6
    option_purple = 7
    option_pink = 8
    option_brown = 9
    option_white = 10
    option_black = 11


click2_options: Dict[str, Type[Option]] = {
    "clicks_to_win": ClicksToWin,
    "clicks_per_check": ClicksPerCheck,
    "button_color": ButtonColor,
}
