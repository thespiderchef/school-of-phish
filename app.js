// The Phisherman
// got rid of stages as i lost track, will remove from all future versions

console.log("The Phisherman: app.js connected");


const emailFromEl = document.getElementById("email-from"); 
const emailSubjectEl = document.getElementById("email-subject"); 
const emailBodyEl = document.getElementById("email-body"); 

console.log("emailFromEl:", emailFromEl);
console.log("emailSubjectEl:", emailSubjectEl);
console.log("emailBodyEl:", emailBodyEl);
if (!emailFromEl || !emailSubjectEl || !emailBodyEl) {
  console.warn("One or more email DOM elements could not be found");
} 
