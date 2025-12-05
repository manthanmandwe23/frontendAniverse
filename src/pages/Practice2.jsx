import { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginFailure } from "../store/slices/authSlice";

export default function Login ()
{
    const navigate = useNavigate()
    const dispatch = useDispatch()
  const [form, setForm] = useState((email = ""), (password = ""));
  const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState( null );
    
    const update = ( e ) =>
    {
        return setForm((prev)=>({...prev, [e]:e.target.value}))
    }

    async function handlelogin(e) {
        e.preventDefault();
        setMessage( null )
        setLoading(true)
        try
        {
            const resp = await loginUser( form )
            const payload = resp.data?.data || resp.data
            if ( !payload ) throw new Error( "Invalid server response" );
            
            const token = payload.token || payload?.token;
            const user = payload.user || payload?.user

            if ( !token ) throw new Error( "Token not found" );
            
            try {
                localStorage.setItem("token",token)
            } catch (_) {}
            navigate("/")
        } catch ( err )
        {
            dispatch(loginFailure())
        }
    }
}

