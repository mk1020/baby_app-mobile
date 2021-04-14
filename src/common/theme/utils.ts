import { Platform } from "react-native"

export const isIos = Platform.OS == "ios"
export const isIpad = Platform.OS == "ios" && Platform.isPad
export const isDroid = Platform.OS != "ios"
