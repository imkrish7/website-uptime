# To Run 

 ## Enter into directory

## Then run

>npm install

## After installation of dependencies

## Then run
>npm run dev


# API END POINTs

# To get all websites
## GET
>/api/all 

# To get detail of particular website
## GET
>/api/detail?name={google}

# To register a website
## POST
>/api/add 

requestBody{
	name: string,
		required: true
	url: string
		required: true
	frequency: number
		required: false
}
