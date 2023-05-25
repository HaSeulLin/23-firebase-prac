import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

import { db } from '../database/firebase'

export default function FireStoreTest() {
  // 파이어스토어에서 가져온 값을 출력
  const [users, setUsers] = useState();

  // 사용자 문서 추가 (파이어스토어)
  const addDocData = async () => {
      //서버에 연결해서 사용하는 것은 비동기함수로 작성
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // 시작하자마자 값 가져오기
  useEffect(()=>{
    // 비동기함수로 작성하여 값 가져옴
    async function getData() {
      // getDocs를 통해서 컬렉션 안의 모든 문서 가져옴
      const querySnapshot = await getDocs(collection(db, "users"));

      let dataArray = [];
      // forEach를 통해서 모든 문서값에 접근하여 원하는 값을 가져온다
      querySnapshot.forEach((doc) => {
        // doc.id와 doc.data()값을 리덕스에 저장하여
        // 웹에서 사용 >> forEach의 모든 내용을 배열로 저장
        console.log(`${doc.id} => ${doc.data().first}`);
        
        dataArray.push(doc.data());
      });
      // 값이 들어간 배열을 state에 넣어서 활용
      setUsers(dataArray);
    }
    getData();
  }, []);

  return (
    <div>
      <h3>파이어스토어의 값을 추가, 가져옴 확인</h3>
      <p>users컬렉션 확인</p>
      <button onClick={addDocData}>버튼을 누르면 파이어스토어에 값 추가</button>
      <br />
      {
        users && users.map((user, index)=>(
          <div key={index}>
            <p>{user.first}, {user.born}</p>
          </div>
        ))
      }
    </div>
  )
}
