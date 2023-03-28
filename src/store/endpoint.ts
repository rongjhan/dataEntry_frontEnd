import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi } from '@reduxjs/toolkit/query/react'
import { ConfigType,ConfigInfo, configStatus,updateConfig } from "./types/index" 


export const api = createApi({
    baseQuery: fetchBaseQuery({baseUrl: '/',}),
    tagTypes: ['source','transform',"visualize"],
    endpoints: (build) => ({
        getConfigs: build.query<configStatus[],ConfigType>({
            query: (configType) => `/configs?configType=${configType}`,
            transformResponse(response:string[], meta, arg) {
                return response.map((name)=>{return {name,executable:undefined,output:undefined}})
            },
        }),
        getConfig: build.query<ConfigInfo,{configType:ConfigType,configName:string}>({
            query: (arg) =>`/config?configType=${arg.configType}&configName=${arg.configName}`,
            providesTags:(result, error, arg) => [{ type: arg.configType, id: arg.configName }],
        }),
        addConfig:build.mutation<string,ConfigType>({
            query: (configType) => ({
                url: `/addConfig?configType=${configType}`,
                responseHandler(response) {return response.text()},
            }),
            async onQueryStarted(arg, {dispatch,queryFulfilled}) {
                try{
                    const { data: newConfigName } = await queryFulfilled
                    console.log("added")
                    dispatch(
                        api.util.updateQueryData("getConfigs",arg,(draft)=>{
                            draft.push({name:newConfigName,executable:undefined,output:undefined})
                        })
                    )
                }catch(e){console.log("addConfig:",e)}
            }
        }),
        delConfig:build.mutation<string,{configType:ConfigType,configName:string}>({
            query: (arg) => ({
                url: `/delConfig?configType=${arg.configType}&configName=${arg.configName}`,
                responseHandler(response) {return response.text()},
            }),
            invalidatesTags:(result, error, arg) => [{ type: arg.configType, id: arg.configName }],
            async onQueryStarted(arg, {dispatch,queryFulfilled}) {
                try{
                    await queryFulfilled
                    dispatch(
                        api.util.updateQueryData("getConfigs",arg.configType,(draft)=>{
                            const index = draft.findIndex( config => config.name === arg.configName)
                            if (index !== -1) draft.splice(index, 1)
                        })
                    )
                }catch(e){console.log("delConfig:",e)}
            }
        }),
        editConfig:build.mutation<string,{configType:ConfigType,configName:string,settings:updateConfig}>({
            query: (arg) => {console.log(arg);return({
                url: `/editConfig`,
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body:JSON.stringify(arg),
                responseHandler(response) {return response.text()},
            })},
            invalidatesTags:(result, error, arg) => [{ type: arg.configType, id: arg.configName }],
            async onQueryStarted(arg, {dispatch,queryFulfilled}) {
                try{
                    await queryFulfilled
                    dispatch(
                        api.util.updateQueryData("getConfigs",arg.configType,(draft)=>{
                                const index = draft.findIndex( config => config.name === arg.configName)
                                draft[index].executable = undefined
                                if(arg.configName!=arg.settings.newName){
                                    draft[index].name = arg.settings.newName
                                }
                                
                        })
                    )
                }catch(e){console.log("editConfig:",e)}
            }
            
        }),
    })
})

window.api = api