import React from 'react'

class CustomButton extends React.Component{
    render(){
        return (
            <div onClick={(e)=>{this.props.buttonClicked(e,this.props.clickName,this.props.clickId)}}>
                {this.props.children}
            </div>
        )
    }
}

export default CustomButton