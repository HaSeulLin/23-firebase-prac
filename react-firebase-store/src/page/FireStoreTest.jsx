import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

import { db } from '../database/firebase'
import { Link } from 'react-router-dom';

export default function FireStoreTest() {
  // 파이어스토어에서 가져온 값을 출력
  const [users, setUsers] = useState();

  // 가져올 값을 개별 state로 가져오기
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [born, setBorn] = useState();
  // 수정 first 값
  const [updateFirst, setUpdateFirst] = useState();
  // 검색할 last 값
  const [searchLast, setSearchLast] = useState();
  // 검색된 state 값
  const [searchUser, setSearchUser] = useState();
  
  // 유저 uid 값이 문서의 uid값일 때, 문서의 값을 찾아올 수 있는지
  // 파이어스토어의 userList의 user(uid)에 boardlist 값을 넣어서 진행해봄
  useEffect(()=>{
    async function getUserData () {
      // doc()을 통해서 값을 찾을 때, getDoc 통해서 한개의 값을 들고옴
      const querySnapshot = await getDoc(doc(db, "userList",'Cqw5HobezMSkLSqonTWf8omEXSz2'));
      console.log(querySnapshot.data())
    }
    getUserData();
  },[]);

  // useEffect 시작하자마자 값 가져오기
  useEffect(()=>{
    getData();
  }, [])  

  // 비동기함수로 작성하여 값 가져옴
  async function getData() {
    // getDocs를 통해서 컬렉션 안의 모든 문서 가져옴
    const querySnapshot = await getDocs(collection(db, "users"));

    let dataArray = [];
    // forEach를 통해서 모든 문서값에 접근하여 원하는 값을 가져온다
    querySnapshot.forEach((doc) => {
      // doc.id와 doc.data()값을 리덕스/state에 저장하여
      // 웹에서 사용 >> forEach의 모든 내용을 배열로 저장

      // id 값을 함께 넣어주기 위해서 새로운 객체 생성
      // id는 doc.id, 객체인 doc.data()는
      // ...(스프레드 연산자)를 통해서 그 안에 있는 값을 꺼내서 씀
      dataArray.push({
        id : doc.id,
        ...doc.data()
      });

      console.log(`${doc.id} => ${doc.data().first}`);
    });
    // 값이 들어간 배열을 state에 넣어서 활용
    setUsers(dataArray);
  }

// 사용자 문서 추가 (파이어스토어)
const addDocData = async () => {
  //서버에 연결해서 사용하는 것은 비동기함수로 작성
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: first,
      last: last,
      born: parseInt(born)
    });
    console.log("Document written with ID: ", docRef.id);
    getData();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// id 값을 가져와서 사용자 문서 삭제
const deleteData = async (id) => {
  // doc(db, 컬렉션 이름, id)로 하나의 문서를 찾을 수 있다
  await deleteDoc(doc(db, "users", id));
  // 추가/삭제/수정도 화면에 바로 갱신된 정보 뜨지 않음
  // getData로 갱신값 불러온다
  getData();
}

// id 값을 가져와서 업데이트 데이터 (first값 수정)
const updateData = async (id) => {
  // 수정할 필드의 값을 객체형태로 넣어줌
  await updateDoc(doc(db, "users", id), {
    first : updateFirst
  });
  getData();
}

// 단일 쿼리를 이용해서 last 값 서치하기
const onSearch = async () => {
  // where 하나를 이용한 단일 쿼리 / users에서 last의 서치값 비교 (똑같아야만 가능)
  // 문자열에서 특정 문자열을 찾을 수 없다
  // 데이터를 세부적으로 사용 > 따로 서버를 만들어서 SQL 또는 noSQL을 사용
  const q = query(collection(db, "users"),
                  where("last", "==", searchLast),
                  // 두 개 이상의 where 사용 시에는
                  // console에 index 값 넣어져야 함 (콘솔 - 색인에서 복합필드 설정)
                  where("born", ">", 1960),
                );

  // 작성한 쿼리 객체를 getDocs를 이용하여 가져옴
  const querySnapshot = await getDocs(q);

  let dataArray= [];
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    // 서치한 내용 화면에 출력할 state 설정
    dataArray.push({
      id : doc.id,
      ...doc.data()
    })
    setSearchUser(dataArray);
  });
}


  return (
    <div>
      <Link to='/'>Home</Link>
      <h3>파이어스토어의 값을 추가, 가져옴 확인</h3>
      <p>users컬렉션 확인</p>
      <div>
        <label htmlFor="">First Name</label>
        <input type="text" onChange={(e)=>(setFirst(e.target.value))}/>
        <label htmlFor="">Last Name</label>
        <input type="text" onChange={(e)=>(setLast(e.target.value))}/>
        <label htmlFor="">Born Year</label>
        <input type="number" onChange={(e)=>(setBorn(e.target.value))}/>
      </div>
      <button onClick={addDocData}>버튼을 누르면 파이어스토어에 값 추가</button>
      <br />
      <hr />
      <label htmlFor="">last 검색</label>
      <input type="text" onChange={(e)=>(setSearchLast(e.target.value))}/>
      <button onClick={onSearch}>검색</button>
      <hr />
      <ol>
        {
          // 검색 결과 출력
          searchUser && searchUser.map((user)=>(
            <li key={user.id}>
              <span>{user.first}, {user.last}, {user.born}</span>
            </li>
          ))
        }
      </ol>
      <hr />
      {
        users && users.map((user)=>(
          <div key={user.id}>
            <span>{user.first}, {user.last}, {user.born}</span>
            <button onClick={()=>deleteData(user.id)}>❌</button>
            <input type="text" onChange={(e)=>(setUpdateFirst(e.target.value))}/>
            <button onClick={()=>updateData(user.id)}>First Name 수정</button>
          </div>
        ))
      }
    </div>
  )
}
