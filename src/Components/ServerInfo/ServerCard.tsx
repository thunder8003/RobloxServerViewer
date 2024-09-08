import { useEffect, useState } from "react";
import Avatar from "../Other/Avatar";
import { Check, X, Users, Wifi, Server } from "lucide-react";
import { Thumbnail } from "../../App";

function ServerCard(props: any) {
    const [toggled, setToggled] = useState(false)
    const [color, setColor] = useState("bg-gray-200 hover:bg-gray-300")

    const Toggle = () => {
      setToggled(!toggled)
    }

    useEffect(() => {

      const def: string = (props['Ping'] < 120 ? "bg-gray-200 hover:bg-gray-300" : "bg-red-300 hover:bg-red-400");

      setColor(toggled ? "bg-green-200 hover:bg-green-300 " : def)
    }, [toggled])

    return (
      <div className={"p-5 rounded grid gap-2  duration-200 shadow shadow-black text-left relative " + color}>
        <button onClick={Toggle} className={"absolute top-2 right-2 w-10 h-10 bg-white rounded shadow shadow-black"}>
          {!toggled && <X className={"w-full h-full"}/>}
          {toggled && <Check className={"w-full h-full"}/>}
        </button>
        <div className={"flex"}>
          <Server/>
          <p className={"ml-1"}>{props['ServerID']}</p>
        </div>
        <div className={"flex"}>
          <Users/>
          <p className={"ml-1"}>{props['Players']}/{props['MaxPlayers']}</p>
        </div>
        <div className={"flex"}>
          <Wifi/>
          <p className={"ml-1"}>{props['Ping']}ms</p>
        </div>
        <div className={"flex justify-center flex-wrap gap-2"}>
          {
            props['Thumbnails'].map((thumbnail: Thumbnail) => {
              return <img className={"rounded-full w-8 h-8 shadow shadow-black duration-500 group-hover:duration-200"} key={thumbnail['token']} src={thumbnail['imageUrl']}/>
            })
          }
        </div>
      </div>
    );
  }
  
  export default ServerCard;
  