import { A } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { getToken } from "../utils/authorization";
import Login from "./Login";

function Dashboard() {

    onMount(()=> {
        let token = window.localStorage.getItem("access_token")
        
        const code = new URLSearchParams(window.location.search).get('code')

        if (!token && code) {         
            getToken(code)
        }
    })

    return (
        <div>
            <h1>Dashboard</h1>
            <Login/>
        </div>
    )
}

export default Dashboard
