import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { optionState } from './types'
import produce from "immer"
import initSource from '../mod_source'
import initVisuaize from '../mod_visualize'
import initTransform from '../mod_tansform'


window.thunk = createAsyncThunk
// 首先, 创建 thunk

export const fetchInit = createAsyncThunk(
    'initApp',
    async (undefined, thunkAPI) => {
      const response = await fetch("../init")
      return response.json()
    }
  )


  // 接着, 在你的 reducers 中处理这些 actions:
export const appSlice = createSlice({
    name: 'init',
    initialState: {
      init:false,
      sourceOption:undefined,
      transformOption:undefined,
      visualizeOption:undefined
    },
    reducers: {
      loadOptionModule:(state,action)=>{return produce(state,draft=>{
        const {configType,optionName,module} = action.payload
        switch(configType){
          case "source":
              draft.sourceOption[optionName].module = module
              break
          case "transform":
              draft.transformOption[optionName].module = module
              break
          case "visualize":
              draft.visualizeOption[optionName].module = module
              break
        }
      })},
    },
    extraReducers: {
      // 在这里添加处理额外 action types 的 reducers, 并且如果有需要的话，也在此处理加载状态
      [fetchInit.fulfilled]: (state, action) => {
        return {
          init:true,
          sourceOption:initSource(action.payload.availableSource),
          transformOption:initTransform(action.payload.availableTransform),
          visualizeOption:initVisuaize(action.payload.availableVisualize)
        }
      }
    }
  })

  window.appSlice = appSlice
  export default appSlice.reducer
