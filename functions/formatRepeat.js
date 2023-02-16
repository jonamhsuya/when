export const formatRepeat = (repeat, minutes) => {
    if (repeat === "Never") {
      return "";
    } else if (repeat !== "By the Minute") {
      return "  |  " + repeat;
    } else {
      return "  |  Every " + (minutes === "1" ? "Minute" : minutes + " Minutes");
    }
  };