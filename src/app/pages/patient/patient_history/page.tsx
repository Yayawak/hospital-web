'use client'
import BasicColumnsGrid from "@/app/components/datagrid"
import PatientHistoryTable from "@/app/components/editable_grid/patient_history/patient.history.grid"
import EditableTable from "@/app/components/editable_grid/room_grid/room_grid"
import FullFeaturedCrudGrid from "@/app/components/gridx"
import Navbar from "@/app/components/navbar"
import TikTok from "@/app/components/tiktok"
import { Button } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

const PatientHistory = () => {
    // let n : number = 10
    // const dummyHeros : IHero[] = [{heroName : "A", attackType: "A"}]
    useEffect(() => {
        sessionStorage.getItem('loggedIn');
        const items = sessionStorage.getItem('loggedIn');
        if (items != 'true') {
            window.location.href = "http://localhost:3000/pages/login";
        }
    }, []);

const onButtonClicked = () => {
    console.log("clicked.")
}

useEffect(() => {
}, [])



return <div style={{
    // backgroundColor: "#404d75"
}}>
    {/* <TikTok isTick={true} size={64}/>
        <TikTok isTick={false}/> */}

    {/* <FullFeaturedCrudGrid /> */}
    {/* <BasicColumnsGrid /> */}
    <div style={{
        width: "80vw",
        height: "80vh",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        // backgroundColor: "red",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "24px"

    }}>
        <PatientHistoryTable />
    </div>
</div>
}

export default PatientHistory