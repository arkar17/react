import React,{useState, useEffect} from 'react'
import "./styles.css"
import Header from '../../components/header'
import Navbar from '../../components/navbar'
import {Navigate} from "react-router-dom"

import {useSelector, useDispatch} from "react-redux"
import RefreeCrud from '../../components/refreecrud'
import { addRefree, deleteRefree, deleteRequest } from '../../redux/refree'
import { axiosInstance } from '../../urlConfig'


const RefreeRequests = () => {

    const [refereeRequests,setRefereeRequests] = useState([])
    const [refereeLists,setRefereeLists] = useState([])

    const [isAddRefree, setIsAddRefree] = useState(false)
    const [isEditRefree, setIsEditRefree] = useState(false)

    const [editRefreeId,setEditRefreeId] = useState("")
    const [title,setTitle] = useState("")

    const dispatch = useDispatch()

    // const {refree_list,refree_requests} = useSelector(state=>state.refree)
    const {user_login} = useSelector(state => state.user)
    const {current_language} = useSelector(state => state.language)

    // const [refreeList,setRefreeList] = useState([])

    // useEffect(()=>{
    //     setRefreeList(refree_list)
    //     // console.log(refree)
    // },[])

    const fetchRefereeRequests = async () => {
        try {
            const requests =await axiosInstance.get('/referee-requests',{headers:{Authorization:`Bearer ${user_login.token}`}})
            const referees = await axiosInstance.get("/showreferees",{headers:{Authorization:`Bearer ${user_login.token}`}})
            console.log(requests)
            console.log(referees)
            if(requests.data.status === 200){
                setRefereeRequests(requests.data.referee_requests)
            }
            if(referees.data.status === 200){
                setRefereeLists(referees.data.referees)
            }
        } catch (error) {
            alert(error.message)
        }
       
    }

    useEffect(() => {
       

       fetchRefereeRequests()
    },[])


    const refreeAddbtn = () => {
        // setIsAddRefree(true)
        // setTitle("Add Refree")
    }

    const refreeEditBtn = (id) => {
        // console.log(refree)
        setIsEditRefree(true)
        setTitle("Edit Refree")
        setEditRefreeId(id)
        // console.log(editRefreeData)
    }

    const refreeDeleteBtn = async (id) => {
        // dispatch(deleteRefree(id))
        // console.log(id)
        try {
            const res = await axiosInstance.delete(`/referees/${id}`,{headers:{Authorization:`Bearer ${user_login.token}`}})
            if(res.data.status === 200){
                alert("Referee Deleted successfully")
                fetchRefereeRequests()
            }
        } catch (error) {
            alert(error.message)
        }
        
        
    }

    const handleAcceptRefreeRequest = async (id) => {
        // const newRefree = {
        //     id: (Math.floor(Math.random() * 1000)).toString(),
        //     name: request.name,
        //     PhNo:request.PhNo,
        //     refId:"ref-001",
        //     joinedOn:"08/15/2022"
        // }
        try {
            const res = await axiosInstance.post(`/accept-referee/${id}`,{},{headers:{Authorization:`Bearer ${user_login.token}`}})
            // console.log(res)
            if(res.data.status){
                alert(res.data.message)
                fetchRefereeRequests()
            }
        } catch (error) {
            alert(error.message)
        }

       

        // dispatch(addRefree(newRefree))
        // dispatch(deleteRequest(request.PhNo))
    } 

    const handleDeleteRefreeRequest = async (id) => {
        try {
            const res = await axiosInstance.post(`/decline-referee/${id}`,{} ,{headers:{Authorization:`Bearer ${user_login.token}`}})
            console.log(res)
            if(res.data.status === 200){
                alert(res.data.message)
                fetchRefereeRequests()
            }
        } catch (error) {
            alert(error.message)
        }
       
    }

    if(user_login.isLoggedIn){
    return (
        <>
            <Header/>
            <Navbar/>

           

            <RefreeCrud title={title} setTitle={setTitle} isAddRefree={isAddRefree} setIsAddRefree={setIsAddRefree} 
            isEditRefree={isEditRefree} setIsEditRefree={setIsEditRefree} editRefreeId={editRefreeId} setEditRefreeId={setEditRefreeId}
            setRefereeRequests={setRefereeRequests} setRefereeLists={setRefereeLists}
            />

            {/* <RefreeCrud title={"Add Refree"} isAddRefree={isAddRefree} setIsAddRefree={setIsAddRefree}/> */}
            <div className='App'>

            
            <div className='refree-requests-parent-container'>
                <div className='refree-requests-container'>
                    <p className='refree-requests-header'>Refree Requests</p>

                    <div className='refree-requests-accdec-parent-container'>
                        <div className='refree-requests-accdec-headers-container'>
                            <p>{current_language === "english" ? "Name" : "???????????????"}</p>
                            <p>{current_language === "english" ? "Phone" : "???????????????"}</p>
                        </div>

                        <div className='refree-requests-accdec-container'>
                            {
                                refereeRequests.map((request,index) => (
                                    <div className='refree-requests-accdec-row'>
                                        <p className='refree-requests-name'>{request.name}</p>
                                        <p className='refree-requests-phno'>{request.phone}</p>
                                        <div className='refree-requests-btn-container'>
                                            <button onClick={() => handleAcceptRefreeRequest(request.id)}>{current_language === "english" ? "Accept" : "???????????????"}</button>
                                            <button onClick={() => handleDeleteRefreeRequest(request.id)}>{current_language === "english" ? "Decline" : "????????????????????????"}</button>
                                        </div>
                                    </div>
                                ))
                            }
                            
                        </div>
                    </div>
                </div>

                <div className='refree-list-parent-container'>

                   

                        <p className='refree-list-header'>{current_language === "english" ? "Referees" : "???????????????????????????"}</p>
                        {/* <button className='refree-crud-add-btn' onClick={() => refreeAddbtn()}>Add</button> */}
                   

                    <div className='refree-list-container'>
                        <div className='refree-list-labels-container'>
                            <p>{current_language === "english" ? "Name" : "???????????????"}</p>
                            <p>{current_language === "english" ? "Phone" : "???????????????"}</p>
                            <p>{current_language === "english" ? "Referre Id" : "??????????????? ID"}</p>
                            <p>{current_language === "english" ? "Joined On" : "??????????????????????????????"}</p>
                        </div>

                        <div className='refree-list-row-container'>
                            {
                                refereeLists?.map((refree,index) => (
                                <div className='refree-list-row'>
                                    <p>{refree.user.name}</p>
                                    <p>{refree.user.phone}</p>
                                    <p>{refree.user.referee_id}</p>
                                    <p>{refree.user.updated_at}</p>
    
                                    <div className='refree-list-editdel-btns-container'>
                                        <button className='refree-list-edit-btn' onClick={() => refreeEditBtn(refree.id)}>{current_language === "english" ? "Edit" : "?????????????????????"}</button>
                                        <button className='refree-list-delete-btn' onClick={() => refreeDeleteBtn(refree.id)}>{current_language === "english" ? "Delete" : "?????????????????????"}</button>
                                    </div>
                                </div>
                                ))
                            }
                            
                            
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>

    )
    }else{
        return(
            <Navigate to ="/" replace={true}></Navigate>
          )
    }
}

export default RefreeRequests