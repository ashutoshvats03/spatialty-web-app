from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .permission import HasRole
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from django.http import JsonResponse
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from myapp.models import UserRole
import os
import pandas as pd

# Define BASE_DIR and construct the absolute path to the CSV file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_file_path_RHS = os.path.join(BASE_DIR, "RHS_Delhi-NCR_data.csv")
df = pd.read_csv(csv_file_path_RHS)
print(df.columns.tolist())  # Check actual column names

columns = [
    "Cracking(%)",
    "Potholes(%)",
    "Shoving(%)",
    "Patch work(%)",
    "Alligator crack(%)",
    "Longitudinal crack(%)",
    "Transverse crack(%)",
    "Bleeding(%)",
    "Raveling(%)",
    "Depression(%)",
    "Edge crack(%)",
]

# Convert all columns to numeric and filter values > 0
results = {}
for col in columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")  # Convert to numeric
    filtered_df = df[df[col] > 0][["Chainage", col]].head(100)  # Get top 100 non-zero
    results[col] = filtered_df.values.tolist()  # Store in dictionary

# Access each list
RHScrack = results["Cracking(%)"]
RHSalligator = results["Alligator crack(%)"]
RHSlongitudinal = results["Longitudinal crack(%)"]
RHStransverse = results["Transverse crack(%)"]
RHSpotholes = results["Potholes(%)"]
RHSshoving = results["Shoving(%)"]
RHSpatchwork = results["Patch work(%)"]
RHSbleeding = results["Bleeding(%)"]
RHSraveling = results["Raveling(%)"]
RHSdepression = results["Depression(%)"]
RHSedgecrack = results["Edge crack(%)"]




csv_file_path_LHS = os.path.join(BASE_DIR, "LHS_Delhi-NCR_data.csv")
df = pd.read_csv(csv_file_path_LHS)
print(df.columns.tolist())  # Check actual column names

columns = [
    "Cracking(%)",
    "Potholes(%)",
    "Shoving(%)",
    "Patch work(%)",
    "Alligator crack(%)",
    "Longitudinal crack(%)",
    "Transverse crack(%)",
    "Bleeding(%)",
    "Raveling(%)",
    "Depression(%)",
    "Edge crack(%)",
]

# Convert all columns to numeric and filter values > 0
results = {}
for col in columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")  # Convert to numeric
    filtered_df = df[df[col] > 0][["Chainage", col]].head(100)  # Get top 100 non-zero
    results[col] = filtered_df.values.tolist()  # Store in dictionary

# Access each list
RHScrack = results["Cracking(%)"]
RHSalligator = results["Alligator crack(%)"]
RHSlongitudinal = results["Longitudinal crack(%)"]
RHStransverse = results["Transverse crack(%)"]
RHSpotholes = results["Potholes(%)"]
RHSshoving = results["Shoving(%)"]
RHSpatchwork = results["Patch work(%)"]
RHSbleeding = results["Bleeding(%)"]
RHSraveling = results["Raveling(%)"]
RHSdepression = results["Depression(%)"]
RHSedgecrack = results["Edge crack(%)"]

data = {
            "Road_Furniture": {
                "one": {
                    "LHS": {
                        "Road Furniture counts of different categories": {
                            "pieChart": {
                                "chartData": [
                                    ["cautionary", "60.5%"],
                                    ["informatory", "24.5%"],
                                    ["mandatory", "15%"],
                                ],
                            },
                            "barChart": {
                                "chartData": [
                                    ["informatory", "157"],
                                    ["cautionary", "388"],
                                    ["mandatory", "96"],
                                ]
                            }
                        },
                        "Distribution of Road Furniture by chainage": {
                            "doubleBarChart": {
                                "chartData": [
                                    ["313+507", "12", "1", "28"],
                                    ["314+437", "11", "5", "15"],
                                    ["320+077", "8", "1", "24"],
                                    ["323+567", "6", "6", "20"],
                                    ["328+037", "8", "6", "18"],
                                    ["331+627", "9", "3", "20"],
                                    ["335+457", "10", "5", "20"],
                                    ["339+137", "13", "7", "15"],
                                    ["341+737", "12", "8", "17"],
                                    ["343+947", "6", "6", "18"],
                                    ["346+507", "11", "4", "11"],
                                    ["349+557", "18", "4", "22"],
                                    ["351+737", "9", "3", "28"],
                                    ["354+017", "6", "4", "20"],
                                    ["356+947", "7", "5", "21"],
                                    ["362+387", "5", "10", "27"],
                                    ["364+927", "4", "6", "26"],
                                    ["367+187", "8", "6", "22"],
                                    ["370+267", "9", "12", "12"],
                                    ["372+147", "5", "4", "10"],
                                ],
                            }
                        }
                    },
                    "RHS": {
                        "Road Furniture counts of different categories": {
                            "pieChart": {
                                "chartData": [
                                    ["cautionary", "6.5%"],
                                    ["informatory", "24.5%"],
                                    ["mandatory", "69%"],
                                ],
                            },
                            "barChart": {
                                "chartData": [
                                    ["informatory", "357"],
                                    ["cautionary", "88"],
                                    ["mandatory", "296"],
                                ]
                            }
                        },
                        "Distribution of Road Furniture by chainage": {
                            "doubleBarChart": {
                                "chartData": [
                                    ["313+507", "12", "1", "28"],
                                    ["314+437", "11", "5", "15"],
                                    ["320+077", "8", "1", "24"],
                                    ["323+567", "6", "6", "20"],
                                    ["328+037", "8", "6", "18"],
                                    ["331+627", "9", "3", "20"],
                                    ["335+457", "10", "5", "20"],
                                    ["339+137", "13", "7", "15"],
                                    ["341+737", "12", "8", "17"],
                                    ["343+947", "6", "6", "18"],
                                    ["346+507", "11", "4", "11"],
                                    ["349+557", "18", "4", "22"],
                                    ["351+737", "9", "3", "28"],
                                    ["354+017", "6", "4", "20"],
                                    ["356+947", "7", "5", "21"],
                                    ["362+387", "5", "10", "27"],
                                    ["364+927", "4", "6", "26"],
                                    ["367+187", "8", "6", "22"],
                                    ["370+267", "9", "12", "12"],
                                    ["372+147", "5", "4", "10"],
                                ],
                            }
                        }
                    }
                }
            },
            "Street_Light": {
                "one": {
                    "LHS": {
                        "Road Furniture counts of different categories": {
                            "pieChart": {
                                "chartData": [
                                    ["Double_warm_street_light_Count", "16.5%"],
                                    ["Solar_signal_light_Count", "24.5%"],
                                    ["Solar_powered_pole_Count", "15%"],
                                    ["Single_arm_street_light_Count", "14"],
                                    ["Solar_street_light_Count", "14"],
                                ],
                            },
                            "barChart": {
                                "chartData": [
                                    ["Double arm", "119"],
                                    ["Single arm", "77"],
                                    ["Solar", "33"],
                                    ["Solar powered", "12"],
                                    ["Solar signal", "39"],
                                ]
                            }
                        },
                        "Distribution of Road Furniture by chainage": {
                            "doubleBarChart": {
                                "chartData": [
                                    ["313+507", "12", "1", "28", "4", "10"],
                                    ["314+437", "11", "5", "15", "6", "12"],
                                    ["320+077", "8", "1", "24", "3", "14"],
                                    ["323+567", "6", "6", "20", "5", "11"],
                                    ["328+037", "8", "6", "18", "7", "13"],
                                    ["331+627", "9", "3", "20", "4", "10"],
                                    ["335+457", "10", "5", "20", "6", "12"],
                                    ["339+137", "13", "7", "15", "8", "14"],
                                    ["341+737", "12", "8", "17", "9", "16"],
                                    ["343+947", "6", "6", "18", "5", "11"],
                                    ["346+507", "11", "4", "11", "6", "13"],
                                    ["349+557", "18", "4", "22", "8", "17"],
                                    ["351+737", "9", "3", "28", "7", "15"],
                                    ["354+017", "6", "4", "20", "4", "12"],
                                    ["356+947", "7", "5", "21", "5", "11"],
                                    ["362+387", "5", "10", "27", "3", "14"],
                                    ["364+927", "4", "6", "26", "2", "10"],
                                    ["367+187", "8", "6", "22", "6", "13"],
                                    ["370+267", "9", "12", "12", "7", "15"],
                                    ["372+147", "5", "4", "10", "3", "8"],
                                ]
                            }
                        }
                    },
                    "RHS": {
                        "Road Furniture counts of different categories": {
                            "pieChart": {
                                "chartData": [
                                    ["Double_warm_street_light_Count", "16.5%"],
                                    ["Solar_signal_light_Count", "24.5%"],
                                    ["Solar_powered_pole_Count", "15%"],
                                    ["Single_arm_street_light_Count", "14"],
                                    ["Solar_street_light_Count", "14"],
                                ],
                            },
                            "barChart": {
                                "chartData": [
                                    ["Double arm", "119"],
                                    ["Single arm", "77"],
                                    ["Solar", "33"],
                                    ["Solar powered", "12"],
                                    ["Solar signal", "39"],
                                ]
                            }
                        },
                        "Distribution of Road Furniture by chainage": {
                            "doubleBarChart": {
                                "chartData": [
                                    ["313+507", "12", "1", "28", "4", "10"],
                                    ["314+437", "11", "5", "15", "6", "12"],
                                    ["320+077", "8", "1", "24", "3", "14"],
                                    ["323+567", "6", "6", "20", "5", "11"],
                                    ["328+037", "8", "6", "18", "7", "13"],
                                    ["331+627", "9", "3", "20", "4", "10"],
                                    ["335+457", "10", "5", "20", "6", "12"],
                                    ["339+137", "13", "7", "15", "8", "14"],
                                    ["341+737", "12", "8", "17", "9", "16"],
                                    ["343+947", "6", "6", "18", "5", "11"],
                                    ["346+507", "11", "4", "11", "6", "13"],
                                    ["349+557", "18", "4", "22", "8", "17"],
                                    ["351+737", "9", "3", "28", "7", "15"],
                                    ["354+017", "6", "4", "20", "4", "12"],
                                    ["356+947", "7", "5", "21", "5", "11"],
                                    ["362+387", "5", "10", "27", "3", "14"],
                                    ["364+927", "4", "6", "26", "2", "10"],
                                    ["367+187", "8", "6", "22", "6", "13"],
                                    ["370+267", "9", "12", "12", "7", "15"],
                                    ["372+147", "5", "4", "10", "3", "8"],
                                ]
                            }
                        }
                    }
                }
            },
            "Pavement_Distress": {
                "one":{
                    "LHS": {
                        "Major Pavement defects(%) per chainage": {
                        "Cracking": {
                            "chartData": RHScrack,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Cracking_severity-based.kml"
                        },
                        "Potholes": {
                            "chartData": RHSpotholes,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Potholes_severity-based.kml"
                        },
                        "Patch Work": {
                            "chartData": RHSpatchwork,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Patch_work_severity-based.kml"
                        }
                        },
                        "Road Cracks (%) per chainage": {
                        "Alligator Crack": {
                            "chartData": RHSalligator,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Alligator_crack.kml"
                        },
                        "Longitudinal": {
                            "chartData": RHSlongitudinal,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Longitudinal_crack.kml"
                        },
                        "Transverse": {
                            "chartData": RHStransverse,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Transverse_crack.kml"
                        },
                        "Edge Crack": {
                            "chartData": RHSedgecrack,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Edge_crack_severity-based.kml"
                        }
                        },
                        # "Pavement Raveling(%) per chainage based on severity": {
                        # "Low": {
                        #     "chartData": [
                        #     ["313+507", "0.090"],
                        #     ["320+137", "0.040"],
                        #     ["326+887", "0.060"],
                        #     ["333+517", "0.045"],
                        #     ["340+277", "0.020"],
                        #     ["346+877", "0.080"],
                        #     ["353+627", "0.025"],
                        #     ["360+257", "0.010"]
                        #     ],
                        #     "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Raveling_severity-based.kml"
                        # }
                        # },
                        "Other Pavement Defects": {
                        "Bleeding": {
                            "chartData": RHSbleeding,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Bleeding_severity-based.kml"
                        },
                        "Depression": {
                            "chartData": RHSdepression,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Depression_severity-based.kml"
                        },
                        "Rutting": {
                            "chartData": [
                            ["313+507", "0.095"],
                            ["320+137", "0.050"],
                            ["326+887", "0.075"],
                            ["333+517", "0.060"],
                            ["340+277", "0.035"],
                            ["346+877", "0.085"],
                            ["353+627", "0.050"],
                            ["360+257", "0.030"]
                            ],
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Rutting.kml"
                        },
                        "Shoving": {
                            "chartData": RHSshoving,
                            "url": "http://localhost:8000/media/kml/LHS-20250208T155709Z-001/LHS/LHS_Shoving_severity-based.kml"
                        }
                        }
                    },
                    "RHS": {
                        "Major Pavement defects(%) per chainage": {
                            "Cracking": {
                                "chartData": [
                                    ["313+507", "0.120"],
                                    ["320+137", "0.060"],
                                    ["326+887", "0.080"],
                                    ["333+517", "0.075"],
                                    ["340+277", "0.020"],
                                    ["346+877", "0.095"],
                                    ["353+627", "0.035"],
                                    ["360+257", "0.015"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Cracking_severity-based.kml"
                            },
                            "Potholes": {
                                "chartData": [
                                    ["313+507", "0.110"],
                                    ["320+137", "0.045"],
                                    ["326+887", "0.060"],
                                    ["333+517", "0.055"],
                                    ["340+277", "0.025"],
                                    ["346+877", "0.075"],
                                    ["353+627", "0.040"],
                                    ["360+257", "0.020"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Potholes_severity-based.kml"
                            },
                            "Patch Work": {
                                "chartData": [
                                    ["313+507", "0.100"],
                                    ["320+137", "0.055"],
                                    ["326+887", "0.075"],
                                    ["333+517", "0.050"],
                                    ["340+277", "0.030"],
                                    ["346+877", "0.065"],
                                    ["353+627", "0.045"],
                                    ["360+257", "0.025"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Patch_work_severity-based.kml"
                            }
                        },
                        "Road Cracks (%) per chainage": {
                            "Alligator Crack": {
                                "chartData": [
                                    ["313+507", "0.150"],
                                    ["320+137", "0.090"],
                                    ["326+887", "0.110"],
                                    ["333+517", "0.100"],
                                    ["340+277", "0.050"],
                                    ["346+877", "0.120"],
                                    ["353+627", "0.060"],
                                    ["360+257", "0.035"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Alligator_crack.kml"
                            },
                            "Longitudinal": {
                                "chartData": [
                                    ["313+507", "0.130"],
                                    ["320+137", "0.070"],
                                    ["326+887", "0.090"],
                                    ["333+517", "0.080"],
                                    ["340+277", "0.035"],
                                    ["346+877", "0.100"],
                                    ["353+627", "0.050"],
                                    ["360+257", "0.030"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Longitudinal_crack.kml"
                            },
                            "Transverse": {
                                "chartData": [
                                    ["313+507", "0.110"],
                                    ["320+137", "0.080"],
                                    ["326+887", "0.070"],
                                    ["333+517", "0.085"],
                                    ["340+277", "0.040"],
                                    ["346+877", "0.095"],
                                    ["353+627", "0.060"],
                                    ["360+257", "0.020"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Transverse_crack.kml"
                            },
                            "Edge Crack": {
                                "chartData": [
                                    ["313+507", "0.125"],
                                    ["320+137", "0.065"],
                                    ["326+887", "0.085"],
                                    ["333+517", "0.070"],
                                    ["340+277", "0.025"],
                                    ["346+877", "0.095"],
                                    ["353+627", "0.045"],
                                    ["360+257", "0.015"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Edge_crack_severity-based.kml"
                            }
                        },
                        "Pavement Raveling(%) per chainage based on severity": {
                            "Low": {
                                "chartData": [
                                    ["313+507", "0.090"],
                                    ["320+137", "0.040"],
                                    ["326+887", "0.060"],
                                    ["333+517", "0.045"],
                                    ["340+277", "0.020"],
                                    ["346+877", "0.080"],
                                    ["353+627", "0.025"],
                                    ["360+257", "0.010"]
                                ],
                                "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Raveling_severity-based.kml"
                            }
                        },
                        "Other Pavement Defects": {
                        "Bleeding": {
                            "chartData": [
                            ["313+507", "0.060"],
                            ["320+137", "0.045"],
                            ["326+887", "0.070"],
                            ["333+517", "0.050"],
                            ["340+277", "0.025"],
                            ["346+877", "0.085"],
                            ["353+627", "0.040"],
                            ["360+257", "0.020"]
                            ],
                            "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Bleeding_severity-based.kml"
                        },
                        "Depression": {
                            "chartData": [
                            ["313+507", "0.080"],
                            ["320+137", "0.055"],
                            ["326+887", "0.090"],
                            ["333+517", "0.065"],
                            ["340+277", "0.030"],
                            ["346+877", "0.095"],
                            ["353+627", "0.055"],
                            ["360+257", "0.025"]
                            ],
                            "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Depression_severity-based.kml"
                        },
                        "Rutting": {
                            "chartData": [
                            ["313+507", "0.095"],
                            ["320+137", "0.050"],
                            ["326+887", "0.075"],
                            ["333+517", "0.060"],
                            ["340+277", "0.035"],
                            ["346+877", "0.085"],
                            ["353+627", "0.050"],
                            ["360+257", "0.030"]
                            ],
                            "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Rutting.kml"
                        },
                        "Shoving": {
                            "chartData": [
                            ["313+507", "0.070"],
                            ["320+137", "0.045"],
                            ["326+887", "0.060"],
                            ["333+517", "0.050"],
                            ["340+277", "0.030"],
                            ["346+877", "0.080"],
                            ["353+627", "0.040"],
                            ["360+257", "0.025"]
                            ],
                            "url": "http://localhost:8000/media/kml/RHS-20250208T155710Z-001/RHS/RHS_Shoving_severity-based.kml"
                        }
                        }
                    }
                }    
           },               
            "Project": [
                ["Numbering", "Project Name", "Description", "Frequency Survey", "Last Survey Date"],
                [
                    "one",
                    "Highway Expansion",
                    "The Highway Expansion project focuses on widening and upgrading National Highway 2 to improve connectivity and accommodate the increasing volume of vehicles. This includes constructing additional lanes, enhancing road safety features, and implementing modern infrastructure to reduce congestion and travel time for commuters and freight transport.",
                    "monthly",
                    "2024-05-15"
                ],
                [
                    "two",
                    "Bridge Construction",
                    "This ambitious Bridge Construction project involves building a state-of-the-art bridge over the Ganges River in Kolkata. The project aims to enhance transportation efficiency, provide a critical link for commuters and cargo, and alleviate the pressure on existing bridges. It also incorporates advanced engineering techniques to ensure durability and environmental sustainability.",
                    "quarterly",
                    "2024-07-01"
                ],
                [
                    "three",
                    "Road Widening Project",
                    "The Road Widening Project on Park Street, Kolkata, seeks to address the issue of traffic congestion in one of the city's busiest areas. By expanding the road and redesigning the intersections, this project will create a smoother flow of vehicles, enhance accessibility for residents and businesses, and improve the overall urban experience in the heart of the city.",
                    "yearly",
                    "2024-08-10"
                ],
                [
                    "four",
                    "Zebra Crossing Installation",
                    "This project aims to enhance pedestrian safety in the bustling Esplanade area of Kolkata by installing clearly marked zebra crossings. The initiative involves modern road markings, traffic signage, and public awareness campaigns to encourage road safety practices and ensure a secure environment for walkers in this high-footfall region.",
                    "quarterly",
                    "2024-09-10"
                ],
                [
                    "five",
                    "Traffic Signal Upgrade",
                    "The Traffic Signal Upgrade project focuses on modernizing and synchronizing traffic signals along the Bangalore-Mysore Road. This initiative aims to reduce traffic jams, improve travel time, and enhance road safety by incorporating advanced signal systems, real-time traffic monitoring, and adaptive signal technology.",
                    "yearly",
                    "2024-06-20"
                ]
            ]
        }


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# admin , password
class LoginView(APIView):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            
            user_role = UserRole.objects.filter(user=user).first()
            role = user_role.role.name if user_role else None
            
            user_serializer = UserSerializer(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_serializer.data, # Include the role in the response
                'data': data
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=401)

class Dashboard(APIView):
    permission_classes = [IsAuthenticated,HasRole]
    required_role='student'

    def get(self, request):
        user = request.user
        user_serializer = UserSerializer(user)
        return Response({
            'message': 'Welcome to the dashboard', 
            'user': user_serializer.data,
        }, status=200)