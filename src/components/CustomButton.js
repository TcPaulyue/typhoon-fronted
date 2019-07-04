import React from 'react'

class CustomButton extends React.Component{
    render(){
        return (
            <div onClick={(e)=>{this.props.buttonClicked(e,this.props.buttonValue)}}>
                {this.props.children}
                
            </div>
        )
    }
}

export default CustomButton