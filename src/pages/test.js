import React from 'react'
import CustomButton from '../components/CustomButton'


class TestPage extends React.Component{
    render(){
          return( 
              <div>
                  <CustomButton
                    value={"haha"}
                    buttonClicked={(e,v)=>{console.log(v)}}>
                      hahaha
                  </CustomButton>
              </div>
          )
    }
}

export default TestPage