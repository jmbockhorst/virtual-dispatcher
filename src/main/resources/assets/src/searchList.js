import React from 'react';

function SearchItem(props){
    return (
        <div className='searchItem' onClick={props.onPress}>{props.firstName} {props.lastName}</div>
    );
}

class SearchList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            found: false,
            foundName: "",
        }
    }

    handleClick(e){
        this.setState({
            found: true,
            foundName: e.target.innerHTML,
        })

        // Set the value to the input box and fire an onChange event
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(this.props.inputBox.current, e.target.innerHTML);

        var ev2 = new Event('input', { bubbles: true});
        this.props.inputBox.current.dispatchEvent(ev2);
    }

    render() {
        const name = this.props.searchInput;

        var searchItems = [];

        if(!this.state.found){
            const main = this;
            if(name != ""){
                this.props.pilots.forEach(function(pilot){
                    //Check if full name is equal to searched
                    //Check if only part of searched name is found
                    var fullName = pilot.firstName + " " + pilot.lastName;
                    if(fullName.toLowerCase() == name.toLowerCase()){
                        main.props.inputBox.current.value = fullName;
                    } else if(pilot.firstName.startsWith(name) || 
                            pilot.firstName.toLowerCase().startsWith(name.toLowerCase()) || 
                            fullName.startsWith(name) || 
                            fullName.toLowerCase().startsWith(name.toLowerCase())){
                        searchItems.push(<SearchItem key={pilot.id} firstName={pilot.firstName} lastName={pilot.lastName} onPress={main.handleClick.bind(main)}/>);
                    }
                });

                //Check last names at the end
                this.props.pilots.forEach(function(pilot){
                    if(pilot.lastName.startsWith(name) || pilot.lastName.toLowerCase().startsWith(name.toLowerCase())){
                        searchItems.push(<SearchItem key={pilot.id} firstName={pilot.firstName} lastName={pilot.lastName} onPress={main.handleClick.bind(main)}/>);
                    }
                });
            }
        } else {
            this.state.found = false;
        }

        return <div id="searchList">{searchItems}</div>;
    }
}

export default SearchList;