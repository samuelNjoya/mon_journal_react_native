import { ScrollView, View } from "react-native"
import React from 'react';
import Profile from "./petitProjet/Profile";
import List from "./petitProjet/List";
import Form from "./petitProjet/Form";

const Historique =()=> {
  return(
    <ScrollView>
         <Profile /> 
         <List />
         <Form />
    </ScrollView>
  )
}

export default Historique