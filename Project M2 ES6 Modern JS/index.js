const httpServer = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');

//Initialising an array to get final total amount
var FinalArr = [];

/// Read data from file
// Template
const tempCourse = fs.readFileSync(
    `${__dirname}/data/loanData.json`,
    'utf-8'
 );

 /////////////////////////////////
// Template
const templateHTMLCourse = fs.readFileSync(
    `${__dirname}/template/templateCourse.html`,
    'utf-8'
  );



 const dataObj = JSON.parse(tempCourse);// string to JavaScript Object JSON

////////////////////////////////
//Create Server
const server = httpServer.createServer( (req, res) =>{// call back function


    const {query,pathname} = url.parse(req.url, true); // object distructors
    if(query.id){// if there is query parameter named id read as string
        // Courses page
        if (pathname === '/' || pathname.toLowerCase() === '/courses') {
            res.writeHead(200, {// Every thing ran successfully
                'Content-type': 'text/html'
            });

            const course = dataObj[Number(query.id)];// convert string to numeric value
            
           
            
           const totalLoanAmt = function (course){

                var Pmt = 250;
                 var monthInterest = course.interest/1200;
                        
                 var Numbermonth = course.loanTermYears * 12  ;
                        
                
                var sample = (1+ monthInterest);
                
                var target = 1-(1/(Math.pow(sample,Numbermonth)));
                
        
                var LoanAmount = (Pmt/monthInterest)*(target);
               
                return LoanAmount;

           }
            const finalAmt = totalLoanAmt(course);
  

        
            let courseHTML = replaceTemplate(templateHTMLCourse, course);// function that will replace the course values in the HTML
           
            courseHTML = courseHTML.replace(/{%LOANAMOUNT%}/g, finalAmt);

            res.end(courseHTML);
            grandTotal(finalAmt);
        }
    }
    else{
            res.writeHead(404, {// Server did not find what you were looking for
                'Content-type': 'text/html'
            });
            res.end(`resource not found`)
        }
    });

    const grandTotal = () => {
        dataObj.forEach(function (item) {
    
            var Pmt = 250;
            var monthInterest = item.interest / 1200;
            // var monthInterest = 0.5;
    
            var Numbermonth = item.loanTermYears * 12;
            //var Numbermonth = 48 ;
    
            var sample = (1 + monthInterest);
            var target = 1 - (1 / (Math.pow(sample, Numbermonth)));
    
            var LoanAmount = (Pmt / monthInterest) * (target);
    
            FinalArr.push(LoanAmount);
            return LoanAmount;
    
        })
        console.log("Array of total loan amounts of each object: "+ FinalArr);
        
        const initialValue = 0;
        const sumWithInitial = FinalArr.reduce(
            (x, y) => x + y,
            initialValue
        );
        console.log("Grand total loan amount is: " + sumWithInitial.toFixed(3));
    
    }

//Start Listening to requests
server.listen(8000, 'localhost', ()=> {
    console.log('Listening to requests on port 8000');
});

