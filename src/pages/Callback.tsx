import { onMount } from 'solid-js';

import { getToken } from '../utils/authorization';

function Callback() {
    onMount(()=>{
        const code = new URLSearchParams(window.location.search).get('code')        
        if (code) getToken(code)
    })

    return <>redirecting...</>
}

export default Callback