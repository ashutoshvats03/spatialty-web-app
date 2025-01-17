git init
 git add .
 git commit -m "unbug commit" 
git branch -M main 
git remote add origin https://github.com/ashutoshvats03/speciality.git
 git push -u origin main

cd backend
python .\manage runserver

cd frotnend
npm rundev
