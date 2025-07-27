"use client";

import {useEffect} from 'react';
import {useRouter} from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Callback from "@/components/Callback";
import Cookies from "js-cookie";

export default function GoogleCallback() {
    const router = useRouter();

    useEffect(() => {
        const sendCode = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            if (!code) return;

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login_google/`, {code});

                const result = response.data;
                const {access, refresh, user} = result.data;

                // Save the JWT
                Cookies.set("access_token", access, {
                  secure: true,
                  sameSite: "strict",
                  path: "/",
                });
                Cookies.set("refresh_token", refresh, {
                  secure: true,
                  sameSite: "strict",
                  path: "/",
                });

                localStorage.setItem("username", user.username);
                localStorage.setItem("email", user.email);
                localStorage.setItem("first_name", user.first_name);
                localStorage.setItem("last_name", user.last_name);
                router.push("/chat"); // Redirect to logged-in page
            } catch (err) {
                console.error(err);
            }
        };

        sendCode();
    }, [router]);

    return (
        <Callback></Callback>
    )
}

