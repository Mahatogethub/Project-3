// for personName
const name=function(name){
    if(/^[A-Za-z, ]{2,80}$/.test(name.trim())) return true
    return false
  }
  
  // for mobile number
  const mobile=function(mobile){
    if(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile)) return true
    return false
  }
  
  // for email id
  const email=function(email){
      if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email) ) return true
      return false
    }
  
    // for body
  const body = function (data) {
      return Object.keys(data).length > 0;
    }

    // for title
    const titleValid=function(title){
        const data=["Mr", "Mrs","Miss"].filter(e1=>e1==title)
       return data.length>0
    }
   
    // password
    const password=function(password){
        if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password) ) return true
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

      const isbn=function(name){
        if(/^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/.test(name.trim())) return true
        return false
      }
      
      const date=function(date){
        if(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(date)) return true
        return false
      }
      const rating=function(rating){
        if(/^[1-5]{1}$/.test(rating)) return true
        return false
      }

      const str=function(name){
        if(/^^(.|\s)*([a-zA-Z]{2,1000})+(.|\s)*$/.test(name.trim())) return true
        return false
      }

    module.exports.valid={body,email,mobile,name,titleValid,password,address,pincode,isbn,date,rating,str}