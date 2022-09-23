// for title
const titleValid=function(title){
    const data=["Mr", "Mrs"," Miss"].filter(e1=>e1==title)
   return data.length>0
}

// password
const password=function(password){
    if(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/.test(password) ) return true
    return false
  }

  const address=function(name){
    if(/^[A-Za-z, 0-9]{2,80}$/.test(name.trim())) return true
    return false
  }
  const pincode=function(name){
    if(/^[0-9]{6}$/.test(name.trim())) return true
    return false
  }


module.exports={titleValid,password,address,pincode}