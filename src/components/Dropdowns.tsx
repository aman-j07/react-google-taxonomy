import { useState, useRef, useEffect } from "react";
import { Alert, Card, Form } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";

let tempdrop: { [key: string]: string } = {};
let tempDropArr = [];
function Dropdowns() {
  const [dropdowns, setDropdowns] = useState<string[][]>([]);
  const refDropdowns = useRef<HTMLSelectElement[]>([]);
  const [error,setError]=useState<string>('')

  //   useEffect to read data from text file and call extract fn
  useEffect(() => {
    fetch("data.txt")
      .then((res) => res.text())
      .then((data) => {
        let splittedText = data.split("\n");
        extractDropdown(splittedText);
      });
  }, []);

  //   function to calculate options for selected option in the dropdowns
  const calDropValues = (ind: number) => {
    // splicing the refDropdowns.current to match with selected dropdown level
    refDropdowns.current.splice(ind + 1);
    // creating array of all the selected values in dropdowns array
    let tempArr: string[] = refDropdowns.current.map((ele) => ele.value);
    let obj: any = tempdrop;
    // looping through array created above to reach the innermost object i.e. the last element of above created array
    tempArr.forEach((ele) => {
      obj = obj[ele];
    });
    // condition to check existing keys and put it on required index in the dropdowns
    let tempDrop = dropdowns;
    tempDrop.splice(ind + 1);
    // condition to check whether whether any objects exist on required key
    if (Object.keys(obj).length > 0) {
      tempDrop[tempArr.length] = Object.keys(obj);
      setError('')
    } else {
      // alert statement for leaf object i.e. it contains 0 keys
      setError('Leaf Object reached.')
    }
    setDropdowns([...tempDrop]);
  };

  //   function to loop through the text array
  const extractDropdown = (textArr: string[]) => {
    textArr.forEach((ele) => {
      // creating array of category names for each line of text file
      let splitted = ele.split(">").map((ele) => ele.trim());
      createNestedObject(tempdrop, splitted);
    });
    tempDropArr.push(Object.keys(tempdrop));
    dropdowns.push(Object.keys(tempdrop));
    setDropdowns([...dropdowns]);
  };

  //   function for creating nested objects
  const createNestedObject = (base: any, names: string[]) => {
    for (var i = 0; i < names.length; i++) {
      base = base[names[i]] = base[names[i]] || {};
    }
  };

  return (
    <Card className="col-6 mx-auto mt-4">
      <CardHeader>
        <h2>Google Taxonomy</h2>
      </CardHeader>
      <Card.Body>
        {dropdowns.map((ele, i) => {
          return (
            <Form.Select
              className="my-3"
              size="lg"
              key={ele[0]}
              ref={(ref: any) => (refDropdowns.current[i] = ref)}
              onChange={() => {
                calDropValues(i);
              }}
            >
              <option value="" selected hidden>
                ---Select Category---
              </option>
              {ele.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          );
        })}
        {error!=='' && <Alert variant="danger">{error}</Alert>}
      </Card.Body>
    </Card>
  );
}

export default Dropdowns;