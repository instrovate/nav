const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Chapter = mongoose.model('Chapter');
const User = mongoose.model('User');
const Section = mongoose.model('Section');
const Application = mongoose.model('Application');
const Admin = mongoose.model('Admin');
AdminBro.registerAdapter(AdminBroMongoose);
const contentParent = {
  name: 'Course Panel',
  icon: 'Book',
}
const adminBro = new AdminBro({
  
    //resources:[Course,Chapter,User],
    resources:[{resource:Course,options:{parent: contentParent, 

    actions: {
        
      list: {
        before: async (request, context) => {
          const { currentAdmin } = context
          if(currentAdmin.role=='2')
          {
          return {
            ...request,
            query: {
               ...request.query,
               'filters.addedBy': currentAdmin._id 
            }
          }
          }
          else
          {
            return {
              ...request
            } 
          }
        },
      bulkDelete: {
        isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
      },  
    show: {
      isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
    },
    edit: {
      isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
    },
    delete: {
      isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
    },

    
    },
  },
  properties: {
    courseDescription: {
      type: 'richtext',
    },
    _id:{
      isVisible: {show:true, list:false, edit:false},
      components: {
        show:
        AdminBro.bundle('./components/course')
      },

    },
    courseAbout:{
      isVisible: {show:true, list:false, edit:true},
      

    },
    },
    
  
  },
},
  {resource:Chapter,options:{parent: contentParent, properties: {
    

    _id:{
      isVisible: {show:true, list:false, edit:false},
      components: {
        show:
        AdminBro.bundle('./components/chapter')
      },
    },
  },
  actions: {
        
    list: {
      before: async (request, context) => {
        const { currentAdmin } = context
        if(currentAdmin.role=='2')
        {
        return {
          ...request,
          query: {
             ...request.query,
             'filters.addedBy': currentAdmin._id 
          }
        }
        }
        else
        {
          return {
            ...request
          } 
        }
      },
    bulkDelete: {
      isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
    },  
  show: {
    isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
  },
  edit: {
    isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
  },
  delete: {
    isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
  },

  
  },
},
},

}, 

{resource:Section, options:{parent: contentParent, properties: {
    sectionDescription: {
      type: 'richtext',
    },
    _id:{
      isVisible: false,
    },
  },
  actions: {
        
    list: {
      before: async (request, context) => {
        const { currentAdmin } = context
        if(currentAdmin.role=='2')
        {
        return {
          ...request,
          query: {
             ...request.query,
             'filters.addedBy': currentAdmin._id 
          }
        }
        }
        else
        {
          return {
            ...request
          } 
        }
      },
    bulkDelete: {
      isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
    },  
  show: {
    isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
  },
  edit: {
    isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
  },
  delete: {
    isAccessible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1' || (currentAdmin.role === '2' && currentAdmin._id === record.param('addedBy'))  )},
  },

  
  },
},
},

},
    
    {resource:User,
      
      options: {parent: { name:'Users panel', icon:'fas fa-person'},
      actions: {
        
        list: {
          isVisible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1'  )},
        }, 
      },
      properties:{
        _id:{
          isVisible: false,
        },
      },    
    },
  
  },
  {resource:Admin,
      
    options: {parent: { name:'Users panel', icon:'fas fa-person'},
    actions: {
        
      list: {
        isVisible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1'  )},
      }, 
    },
    properties:{
      _id:{
        isVisible: false,
      },
    },    
  },

},
    {resource:Application,options: {parent: { name:'Leads', icon:'fas fa-edit'},
    actions: {
        
      list: {
        isVisible: ({ currentAdmin, record }) => {  return currentAdmin && ( currentAdmin.role === '1'  )},
      }, 
    },
    properties:{
      _id:{isVisible:false,},
      picture:{
        isVisible: {show:true, list:false, edit:false},
        components: {
          show:
          AdminBro.bundle('./components/application')
        },
      },
    },  
  },

},
  ],
  rootPath: '/admin',
  branding:{companyName:'Instrovate',softwareBrothers:false},
  
  
/*
  pages: {
    addCourse: {
      label: "Add Course",
      handler: async (request, response, context) => {
        return {
          text: 'I am fetched from the backend',
        }
      },
      component: AdminBro.bundle('./components/add-course'),
    },
  },
  */
 
  dashboard: {
    component: AdminBro.bundle('./components/my-dashboard-component')
  },
  
})


/*
const ADMIN = {
email:process.env.ADMIN_EMAIL || 'info@instrovate.com',
password:process.env.ADMIN_PASSWORD || 'Pass!@#123',
};
*/
module.exports = adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await Admin.findOne({ email })
    if (user) {
      //const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (password==user.password) {
        
        return user
      }
    }
    return false
  },
  cookiePassword: 'Pass@123',
});