import React ,{useState,useEffect}from "react";
import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import axios from "axios";

function onboarding() {
  const router = useRouter();
  const [ {userInfo,newUser},dispatch] = useStateProvider() || [{}];
  const [name, setName] = useState(userInfo?.name ||"");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() =>{
    if(!newUser && !userInfo?.email) router.push("/login");
    else if(!newUser) router.push("/");

  },[newUser,userInfo,router]);

  const onboardUserHandler = async() =>{
    if(validateDetails()){
       const email = userInfo.email;
       try{
        const { data } = await axios.post(ONBOARD_USER_ROUTE,{
            name,
            about,
            email,
            image
        });
        if(data.status){
          dispatch({type:reduceCases.SET_NEW_USER,newUser:false});
          dispatch({
            type: reduceCases.SET_USER_INFO,userInfo:{
              id:data.id,
              name,
              email,
              profileImage:image,
              status:about,

            },
          })
          router.push("/")
        }

       }catch(err){
        console.log(err);
       }
    }

  };
  const validateDetails = () =>{
    if(name.length<5){
      alert("Please enter")
      return false;
    }
    return true;
  }
  return <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
  <div className="flex items-center justify-center gap-2">
    <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
    <span className="text-7xl">Whatsapp</span>
    </div>
    <h2 className="text-2xl">Create your profile</h2>
    <div className="flex gap-6 mt-5">
      <div className="flex flex-col items-center justify-center mt-5 gap-6">
       <Input  name="Display name " state={name} setState={setName} label/>
       <Input name="About" state={about} setState={setAbout} label/>
       <div className="flex items-center justify-center">
        <button className="flex items-center justify-center gap-5 bg-search-input-container-background p-5 rounded-lg" 
        onClick ={onboardUserHandler} >Create Profile</button>

       </div>
      </div>
      <div>
        {/* <Image src="/default_avatar.png" width={100} height={100}/> */}
        <Avatar  type="xl" image={image} setImage={setImage}/>
      </div>
    </div>
  </div>


}

export default onboarding;
