import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { auth } from '../database/firebase';
import { userLogin, userLogout } from '../slice/userSlice';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
    // 로그인 해서 리덕스에 저장한 값은 새로고침 전까지 유지
    const user = useSelector((state)=>(state.user.user));
    const dispatch = useDispatch();

    // 새로고침 해도 + 창 꺼도 로그인 유지 시키기 (로그아웃 해야 로그아웃됨)
    // 새로고침할 때, auth에 로그인이 되어있다면 값을 가져옴
    // useEffect(()=>{
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //           // User is signed in, see docs for a list of available properties
    //           // https://firebase.google.com/docs/reference/js/firebase.User
    //             const uid = user.uid;
    //             dispatch(userLogin({
    //                 name : user.displayName,
    //                 email : user.email,
    //                 uid : user.uid,
    //                 photo : user.photoURL
    //             }))
    //         } else {
    //           // User is signed out
    //           // ...
    //         }
    //     });
    // }, []);

    
    // 세션 스토로지로 유저 데이터 저장 
    // 새로고침 했을 때 세션 값은 살아있다 (브라우저 저장이라 새.고하면 빠르게 데이터 로딩)
    // 단 페이지가 완전히 꺼지면 값은 사라진다
    // 각 데이터마다 살아있는 기간을 고려해서 사용
    useEffect(()=>{
        const userData = sessionStorage.getItem('user');
        // storage로 들고오는 값은 문자열
        // parse로 문자열에서 객체로 변경
        // if문 사용 시 userData 값이 있을 때 저장: 한 번 로그인 했다는 의미
        dispatch(userLogin(JSON.parse(userData)))
    }, [])



    // 로그아웃
    const logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            dispatch(userLogout());
            // 세션 초기화
            sessionStorage.clear();
        }).catch((error) => {
            // An error happened.
        });
    }

  return (
    <div>
        <h1>Home</h1>
        <Link to='/test'>파이어스토어 테스트</Link>
        {
            user ?
            <div>
                <img src={user.photo} alt="" />
                <h3>{user.name}님이 로그인 하셨습니다.</h3>
                <p>{user.email}</p>
                <button onClick={logout}>Logout</button>
            </div>
            : 
            <Link to='/login'>로그인</Link>
        }
    </div>
  )
}
