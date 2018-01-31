require('has-git').hasGit().then(resp => {
  console.log(resp)
})

require('has-git').isDirty().then(resp => {
  console.log(resp)
})