'use strict';

const addBtn = document.querySelector('.add-btn');
const removeBtn = document.querySelector('.remove-btn');
const modalCont = document.querySelector('.modal-cont');
const mainCont = document.querySelector('.main-cont');
const textAreaCont = document.querySelector('.textarea-cont');
// const allPriorityColors = document.querySelectorAll('.priority-color');

// use for toggling.
let addFlag=false;
let removeFlag=false;




//add functionality
addBtn.addEventListener('click',function(e){
    //create/Display modal
    //addFlag=true :display-->modal
    //addFlag=false :hide-->modal

    addFlag = !addFlag; //for toggle
    
    if(addFlag){
        modalCont.style.display ='flex';
    }else{
        modalCont.style.display ='none';
    }
    //generate-Ticket
});