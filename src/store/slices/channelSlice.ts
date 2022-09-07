import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channel } from "@/types/data";
import differenceBy from "lodash/differenceBy";
import homeApi from "../services/channelApi";

type ChannelState = {
  userChannel: Channel[] | [];
  allChannel: Channel[] | [];
  restChannel: Channel[] | [];
  activeChannel: string;
};

const channelSlice = createSlice({
  name: "channelState",
  // 初始值
  initialState: {
    userChannel: [],
    allChannel: [],
    restChannel: [],
    activeChannel: "",
  } as ChannelState,
  // reducers
  reducers: {
    setActiveChannel(state, action: PayloadAction<number>) {
      state.activeChannel = action.payload + "";
    },
  },
  // 外部action
  extraReducers: (build) => {
    build
      .addMatcher(
        homeApi.endpoints.getChannels.matchFulfilled,
        (state, action) => {
          state.userChannel = action.payload.channels;
          state.activeChannel = action.payload.channels[0].id + "";

          state.restChannel = differenceBy(
            state.allChannel,
            state.userChannel,
            "id"
          );
        }
      )
      .addMatcher(
        homeApi.endpoints.getAllChannels.matchFulfilled,
        (state, action) => {
          state.allChannel = action.payload.data.channels;
          state.restChannel = differenceBy(
            state.allChannel,
            state.userChannel,
            "id"
          );
        }
      );
  },
});

export const { setActiveChannel } = channelSlice.actions;

export default channelSlice.reducer;
