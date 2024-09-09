import { useEffect, useRef, useState } from "react";
import ServerCard from "./Components/ServerInfo/ServerCard";
import { LoaderCircle } from "lucide-react";

const BUTTON_PRIMARY = " bg-blue-400 active:bg-blue-500"
const BUTTON_SECONDARY = " bg-gray-400 active:bg-gray-500"

interface ServerData {
  id: string,
  maxPlayers: number,
  playing: number,
  playerTokens: string[],
  fps: number,
  ping: number
}

export interface Thumbnail {
  token: string,
  imageUrl: string
}

interface ResData {
  previousPageCursor: string,
  nextPageCursor: string,
  data: ServerData[],
  thumbnails: Thumbnail[]
}


function App() {
  const [gameID, setGameID] = useState<string | null | undefined>(null)
  const [resData, setResData] = useState<ResData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [ascending, setAscending] = useState<boolean>(true)
  const [excludeFull, setExcludeFull] = useState<boolean>(true)

  const gameIDRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gameID === null || gameID === undefined)
      return
    localStorage.setItem('gameID', gameID)

    async function FetchData() {
      setLoading(true)
      try {
        // const res = await fetch(`https://test.teslasemi.workers.dev/?GameID=${gameID}`, {method: 'get', mode: "cors", headers: {'accept': 'application/json'}})
        const res = await fetch(`http://127.0.0.1:8787/?GameID=${gameID}&SortOrder=${ascending ? 'Asc' : 'Desc'}&ExcludeFullGames=${excludeFull}`, {method: 'get', mode: "cors", headers: {'accept': 'application/json'}})
        if (res.ok) {
          const json: ResData = (await res.json()) as ResData
          setResData(json)
        } else {
          console.log('Response wasn\'t ok!')
        }
        
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }

    FetchData()
  }, [gameID, ascending, excludeFull])

  useEffect(() => {
    const savedGameID: string | null = localStorage.getItem('gameID')

    if (savedGameID !== null) {
      setGameID(savedGameID)
      if (gameIDRef.current !== null) {
        gameIDRef.current.value = savedGameID
      }
    }
      
  }, [])

  return (
    <>
        {loading && <LoaderCircle className={'fixed w-40 h-40 z-10 left-[calc(50%-80px)] top-[calc(50%-80px)] animate-spin'}/>}
        <div className={"m-10 sticky z-10 top-5 grid grid-cols-1 gap-3"}>
          <div className={"flex gap-2 justify-center"}>
            <input ref={gameIDRef} className={"bg-gray-800 text-white rounded p-1 shadow shadow-black"} placeholder={'Game ID'} type={"text"} />
            <button className={"bg-red-400 rounded p-1 active:bg-red-500 shadow shadow-black"} onClick={() => {if (loading) return; setGameID(gameIDRef.current?.value)}}>Update</button>
          </div>
          <div className={"flex gap-2 justify-center"}>
            <button onClick={() => {if (loading) return; setAscending(true)}} className={"rounded w-32 shadow shadow-black" + (ascending ? BUTTON_PRIMARY : BUTTON_SECONDARY)}>Ascending</button>
            <button onClick={() => {if (loading) return; setAscending(false)}} className={"rounded w-32 shadow shadow-black" + (ascending ? BUTTON_SECONDARY : BUTTON_PRIMARY)}>Descending</button>
          </div>
          <button onClick={() => {if (loading) return; setExcludeFull(!excludeFull)}} className={"rounded w-[16.5rem] shadow shadow-black mx-auto" + (excludeFull ? BUTTON_PRIMARY : BUTTON_SECONDARY)}>Exclude Full Games</button>
        </div>

        <div className={"m-5 sm:mx-auto sm:max-w-screen-2xl grid grid-cols-3 gap-5"}>
          {
          resData?.data?.map((data: ServerData) => {

            const thumbnails = resData.thumbnails.filter((thumbnail) => {
              return data['playerTokens'].indexOf(thumbnail['token']) !== -1
            })

            console.log(data['playerTokens'])
            console.log(thumbnails)

            return <ServerCard key={data['id']} ServerID={data['id']} Thumbnails={thumbnails} Players={data['playing']} MaxPlayers={data['maxPlayers']} Ping={data['ping']} />
          })
          }
        </div>
    </>
  );
}

export default App;
