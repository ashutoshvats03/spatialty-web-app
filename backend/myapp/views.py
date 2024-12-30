from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
# Create your views here.
# views.py
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import LoginSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import LoginSerializer, RegisterSerializer

# Register view
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login view
@api_view(['POST'])
def login_view(request):
    print("Frontend connected to backend")
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)  # Django login session
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Logout view
@api_view(['POST'])
def logout_view(request):
    logout(request)  # Django logout
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def index(request):
    return Response({
        "change": "true",
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
            "one": {
                "LHS": {
                "Major Pavement defects(%) per chainage": {
                    "crack": {
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
                        "data": [
                            "Shoving", "Patchwork", "Rutting"
                        ],
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
                        "data": [
                            "Shoving", "Rutting", "Potholes"
                        ],
                    },
                    "Patchwork": {
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
                        "data": [
                            "Shoving", "Rutting", "Patchwork"
                        ]
                    },
                },
                "Road Cracks (%) per chainage": {
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
                        "data": [
                            "Shoving", "Cracking", "Rutting"
                        ]
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
                        "data": [
                            "Rutting", "Cracking", "Patchwork"
                        ]
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
                        "data": [
                            "Rutting", "Raveling", "Shoving"
                        ]
                    },
                    "High": {
                        "chartData": [
                            ["313+507", "0.140"],
                            ["320+137", "0.090"],
                            ["326+887", "0.110"],
                            ["333+517", "0.100"],
                            ["340+277", "0.050"],
                            ["346+877", "0.120"],
                            ["353+627", "0.060"],
                            ["360+257", "0.035"]
                        ],
                        "data": [
                            "Shoving", "Cracking", "Raveling"
                        ]
                    }
                }
                },
                "RHS": {
                "Major Pavement defects(%) per chainage": {
                    "crack": {
                        "chartData": [
                            ["313+507", "0.110"],
                            ["320+137", "0.045"],
                            ["326+887", "0.065"],
                            ["333+517", "0.050"],
                            ["340+277", "0.020"],
                            ["346+877", "0.070"],
                            ["353+627", "0.035"],
                            ["360+257", "0.010"]
                        ],
                        "data": [
                            "Shoving", "Cracking", "Rutting"
                        ]
                    }
                },
                "Road Cracks (%) per chainage": {
                    "Alligator": {
                        "chartData": [
                            ["313+507", "0.150"],
                            ["320+137", "0.100"],
                            ["326+887", "0.120"],
                            ["333+517", "0.105"],
                            ["340+277", "0.060"],
                            ["346+877", "0.130"],
                            ["353+627", "0.080"],
                            ["360+257", "0.040"]
                        ],
                        "data": [
                            "Cracking", "Rutting", "Shoving"
                        ]
                    }
                },
                "Pavement Raveling(%) per chainage based on severity": {
                    "Medium": {
                        "chartData": [
                            ["313+507", "0.120"],
                            ["320+137", "0.070"],
                            ["326+887", "0.085"],
                            ["333+517", "0.090"],
                            ["340+277", "0.040"],
                            ["346+877", "0.110"],
                            ["353+627", "0.050"],
                            ["360+257", "0.030"]
                        ],
                        "data": [
                            "Raveling", "Rutting", "Shoving"
                        ]
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
                25,
                "2024-05-15"
            ],
            [
                "two",
                "Bridge Construction",
                "This ambitious Bridge Construction project involves building a state-of-the-art bridge over the Ganges River in Kolkata. The project aims to enhance transportation efficiency, provide a critical link for commuters and cargo, and alleviate the pressure on existing bridges. It also incorporates advanced engineering techniques to ensure durability and environmental sustainability.",
                40,
                "2024-07-01"
            ],
            [
                "three",
                "Road Widening Project",
                "The Road Widening Project on Park Street, Kolkata, seeks to address the issue of traffic congestion in one of the city's busiest areas. By expanding the road and redesigning the intersections, this project will create a smoother flow of vehicles, enhance accessibility for residents and businesses, and improve the overall urban experience in the heart of the city.",
                15,
                "2024-08-10"
            ],
            [
                "four",
                "Zebra Crossing Installation",
                "This project aims to enhance pedestrian safety in the bustling Esplanade area of Kolkata by installing clearly marked zebra crossings. The initiative involves modern road markings, traffic signage, and public awareness campaigns to encourage road safety practices and ensure a secure environment for walkers in this high-footfall region.",
                10,
                "2024-09-10"
            ],
            [
                "five",
                "Traffic Signal Upgrade",
                "The Traffic Signal Upgrade project focuses on modernizing and synchronizing traffic signals along the Bangalore-Mysore Road. This initiative aims to reduce traffic jams, improve travel time, and enhance road safety by incorporating advanced signal systems, real-time traffic monitoring, and adaptive signal technology.",
                35,
                "2024-06-20"
            ]
        ]
    })