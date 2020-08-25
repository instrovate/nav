// user-content-in-list.jsx
import React from 'react'

const courseContentList = (props) => (
    
    <div class="container"><div class="row"><h1 class="col-md-12 align_center">Add Course</h1><form method="POST" action="/insert_course">
                    <div class="form-group"><label>Enter Course Name</label><input class="form-control" type="text" name="coursename"/></div>
                    <div class="form-group"><label>Enter Course Description</label><textarea class="form-control" name="coursedescription"></textarea></div><input class="btn btn-primary" type="submit" name="name" value="submit"/>
                </form>
            </div>
        </div>
    
)

export default courseContentList