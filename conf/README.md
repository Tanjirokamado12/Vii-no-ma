### What is first.bin?
`first.bin` is a file initially served as configuration pointing to URLs the channel should request.

I don't know because the file is encrypted,but i have decrypt and encrypt key 
 
### How to create a first.bin

This is AES-128-CBC encrypted, using keys available within the app's main arc.

To decrypt an existing one:
```
openssl aes-128-cbc -d -in first.bin -out first.txt -K 943B13DD87468BA5D9B7A8B899F91803 -iv 66B33FC1373FE506EC2B59FB6B977C82
```

To encrypt:
```
openssl aes-128-cbc -e -in first.txt -out first.bin -K 943B13DD87468BA5D9B7A8B899F91803 -iv 66B33FC1373FE506EC2B59FB6B977C82
```

And Remplace every URLS to http:// (Your IPV4)/url1 url2 or URL3 or follow the example

And Change version to 1,if 9999 set,Wii Room will show service is ended message