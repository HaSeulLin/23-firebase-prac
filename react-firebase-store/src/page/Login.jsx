import React from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../database/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../slice/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // 생성자 new를 이용하여 새로운 객체를 생성
    const provider = new GoogleAuthProvider();

    const user = useSelector((state)=>(state.user));
    const dispatch = useDispatch();
    const navigate = useNavigate('');

    // 구글로 로그인
    const onGoogleLogin = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            console.log(user.email, user.displayName);
            dispatch(userLogin({
                name : user.displayName,
                email : user.email,
                uid : user.uid,
                photo : user.photoURL
            }));

            // 세션 스토리지에 값 저장하기
            // 그 값을 문자로 만들어서 저장
            // 새로고침 했을 때만 그 값을 유지 (창을 끄면 데이터 사라짐)
            const userData = {
                name : user.displayName,
                email : user.email,
                uid : user.uid,
                photo : user.photoURL
            };
            sessionStorage.setItem('user', JSON.stringify(userData))

            navigate('/');

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

  return (
    <div>
        <h1>Login</h1>
        <button onClick={onGoogleLogin}>구글로 로그인</button>
    </div>
  )
}
