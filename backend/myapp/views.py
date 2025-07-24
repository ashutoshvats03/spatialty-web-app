from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
# from django.contrib.auth.models import User
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
import os
import pandas as pd
import numpy as np  # Add this at the top of your script
from pathlib import Path
from django.db.models import F
from myapp.models import Role, UserRole , User
from django.contrib.auth.hashers import check_password
from rest_framework import status


# Define BASE_DIR and construct the absolute path to the CSV file
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# RHS CSV
csv_file_path_RHS = os.path.abspath(
    os.path.join(MEDIA_ROOT, "csv", "RHS_Delhi-NCR_data.csv")
)
df = pd.read_csv(csv_file_path_RHS)
# print(df.columns.tolist())  

chainage_column = "Chainage" 
chainage_values_RHS = df[chainage_column].tolist()  # Get all chainage values of RHS 

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
    "Rutting(%)",
]

# Convert all columns to numeric and filter values > 0
results = {}
for col in columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")  # Convert to numeric
    filtered_df = df[df[col] > 0][["Chainage", col]]  # Get top 100 non-zero
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
RHSrutting = results["Rutting(%)"]


# LHS CSV
csv_file_path_LHS = os.path.abspath(
    os.path.join(BASE_DIR, "..","backend", "media", "csv", "LHS_Delhi-NCR_data.csv")
)
df = pd.read_csv(csv_file_path_LHS)
# print(df.columns.tolist())  # Check actual column names

chainage_column = "Chainage" 
chainage_values_LHS = df[chainage_column].tolist()  # Get all chainage values of LHS 

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
    "Rutting(%)",
]

# Convert all columns to numeric and filter values > 0
results = {}
for col in columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")  # Convert to numeric
    filtered_df = df[df[col] > 0][["Chainage", col]]  # Get top 100 non-zero
    results[col] = filtered_df.values.tolist()  # Store in dictionary

# Access each list
LHScrack = results["Cracking(%)"]
LHSalligator = results["Alligator crack(%)"]
LHSlongitudinal = results["Longitudinal crack(%)"]
LHStransverse = results["Transverse crack(%)"]
LHSpotholes = results["Potholes(%)"]
LHSshoving = results["Shoving(%)"]
LHSpatchwork = results["Patch work(%)"]
LHSbleeding = results["Bleeding(%)"]
LHSraveling = results["Raveling(%)"]
LHSdepression = results["Depression(%)"]
LHSedgecrack = results["Edge crack(%)"]
LHSrutting = results["Rutting(%)"]


# Plantation CSV
csv_file_path_plantation = os.path.abspath(
    os.path.join(BASE_DIR, "..","backend", "media", "csv", "plantation.csv")
)
df = pd.read_csv(csv_file_path_plantation)
# print(df.columns.tolist())  # Check actual column names

chainage_column = "Chainage" 
column = "Shrub count"
df[column] = pd.to_numeric(df[column], errors="coerce").fillna(0).astype(int)  # Convert to numeric
filtered_df = df[df[column] > 0][[chainage_column, column]]  # Get top 100 non-zero
result = filtered_df.values.tolist()  # Store in dictionary
plantation = [
        row for row in result
        if not (isinstance(row[0], float) and np.isnan(row[0]))
    ]
# print(plantation)


# Street Light CSV
csv_file_path_street_light = os.path.abspath(
    os.path.join(BASE_DIR, "..","backend", "media", "csv", "Street_light.csv")
)
df = pd.read_csv(csv_file_path_street_light)

# Define the columns we want to work with
chainage_column = "Chainage"
data_columns = [
    "double arm street light Count",
    "single arm street light Count",
    "solar signal light Count",
    "solar street light Count",
    "solar-powered pole Count"
]

# Convert columns to numeric
for col in data_columns:
    df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

# Filter rows where at least one of the columns has a value > 0
combined_df = df[df[data_columns].gt(0).any(axis=1)]

# Convert chainage to string format
Street_light = [
    [f"{row[chainage_column]}"] + [str(row[col]) for col in data_columns]
    for _, row in combined_df.iterrows()
]

# **CUSTOM NAMES for Pie Chart**
custom_pie_chart_names = {
    "double arm street light Count": "Double_arm",
    "single arm street light Count": "Single_arm",
    "solar signal light Count": "Solar_signal",
    "solar street light Count": "Solar_street",
    "solar-powered pole Count": "Solar_pole"
}

# Generate Pie Chart Data
category_counts = {col: df[col].sum() for col in data_columns}
total_street_lights = sum(category_counts.values())   # Avoid division by zero

Street_light_pie_chart = [
    [custom_pie_chart_names[col], f"{round((count / total_street_lights) * 100, 1)}%"]
    for col, count in category_counts.items()
]

# Display the results
# print("\nStreet Light Data:")
# print(Street_light)

# print("\nStreet Light Pie Chart Data:")
# print(Street_light_pie_chart)


# Road Furniture CSV
csv_file_path_furniture = os.path.abspath(
    os.path.join(BASE_DIR, "..","backend", "media", "csv", "LHS_Road furniture.csv")
)

# Read the CSV
df = pd.read_csv(csv_file_path_furniture)

chainage_column = "Chainage"
data_columns = ["Mandatory", "Cautionary", "Informatory"]

# Convert to numeric
for col in data_columns:
    df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

# 1. Generate pie chart data - showing category distribution
category_counts = {col.lower(): len(df[df[col] > 0]) for col in data_columns}

# Calculate total signs
total_signs = sum(category_counts.values()) or 1

# Calculate percentages and format for pie chart
Pie_chart = [[category, f"{round((count / total_signs) * 100, 1)}%"] for category, count in category_counts.items()]

# 2. Generate Road_furniture data - with chainage details
combined_df = df[df[data_columns].gt(0).any(axis=1)]

# Convert chainage to the required format (e.g., "313+507") and ensure all values are strings
Road_furniture = [
    [f"{(row[chainage_column])}",
     str(row["Mandatory"]), str(row["Cautionary"]), str(row["Informatory"])]
    for _, row in combined_df.iterrows()
]

# Print output
# print("\nPie Chart Data:")
# print(Pie_chart)

# print("\nRoad Furniture Data:")
# print(Road_furniture)

data = {
            "Road_Furniture": {
                "one": {
                    "LHS": {
                        "Road Furniture counts of different categories": {
                            "pieChart": {
                                "chartData":Pie_chart,
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
                                "chartData": Road_furniture,
                            }
                        }
                    },
                    "RHS": {
                        "Road Furniture counts of different categories": {
                            "pieChart": {
                                "chartData": Pie_chart,
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
                                "chartData": Road_furniture,
                            }
                        }
                    }
                }
            },
            "Street_Light": {
                "one": {
                    "LHS": {
                        "Street Light counts of different categories": {
                            "pieChart": {
                                "chartData": Street_light_pie_chart,
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
                        "Distribution of street lights by chainage": {
                            "doubleBarChart": {
                                "chartData": Street_light
                            }
                        },
                        
                    },
                    "RHS": {
                        "Road Furniture counts of different categories": {
                            "pieChart": {
                                "chartData": Street_light_pie_chart,
                            },

                            "barChart": {
                                "chartData": [
                                    ["Double arm", "121"],
                                    ["Single arm", "80"],
                                    ["Solar", "35"],
                                    ["Solar powered", "10"],
                                    ["Solar signal", "41"],
                                ]
                            }
                        },
                        "Distribution of Road Furniture by chainage": {
                            "doubleBarChart": {
                                "chartData": Street_light
                            }
                        }
                    }

                }
            },
           "Pavement_Distress": {
                        "one": {
                            "RHS": {
                                "Cracking": {
                                    "chartData": RHScrack,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Cracking_severity-based.kml"
                                },
                                "Potholes": {
                                    "chartData": RHSpotholes,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Potholes_severity-based.kml"
                                },
                                "Patch Work": {
                                    "chartData": RHSpatchwork,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Patch_work_severity-based.kml"
                                },
                                "Alligator Crack": {
                                    "chartData": RHSalligator,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Alligator_crack.kml"
                                },
                                "Longitudinal": {
                                    "chartData": RHSlongitudinal,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Longitudinal_crack.kml"
                                },
                                "Transverse": {
                                    "chartData": RHStransverse,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Transverse_crack.kml"
                                },
                                "Edge Crack": {
                                    "chartData": RHSedgecrack,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Edge_crack_severity-based.kml"
                                },
                                "Bleeding": {
                                    "chartData": RHSbleeding,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Bleeding_severity-based.kml"
                                },
                                "Depression": {
                                    "chartData": RHSdepression,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Depression_severity-based.kml"
                                },
                                "Rutting": {
                                    "chartData": RHSrutting,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Rutting.kml"
                                },
                                "Shoving": {
                                    "chartData": RHSshoving,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Shoving_severity-based.kml"
                                }
                            },
                            "LHS": {
                                "Cracking": {
                                    "chartData": LHScrack,

                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Cracking_severity-based.kml"
                                },
                                "Potholes": {
                                    "chartData": LHSpotholes,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Potholes_severity-based.kml"
                                },
                                "Patch Work": {
                                    "chartData": LHSpatchwork,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Patch_work_severity-based.kml"
                                },
                                "Alligator Crack": {
                                    "chartData": LHSalligator,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Alligator_crack.kml"
                                },
                                "Longitudinal": {
                                    "chartData": LHSlongitudinal,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Longitudinal_crack.kml"
                                },
                                "Transverse": {
                                    "chartData": LHStransverse,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Transverse_crack.kml"
                                },
                                "Edge Crack": {
                                    "chartData": LHSedgecrack,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Edge_crack_severity-based.kml"
                                },
                                "Bleeding": {
                                    "chartData": LHSbleeding,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Bleeding_severity-based.kml"
                                },
                                "Depression": {
                                    "chartData": LHSdepression,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Depression_severity-based.kml"
                                },
                                "Rutting": {
                                    "chartData": LHSrutting,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Rutting.kml"
                                },
                                "Shoving": {
                                    "chartData": LHSshoving,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Shoving_severity-based.kml"
                                }
                            }
                        }
                    },
            "Project": [
                ["Numbering", "Project Name", "Description", "Frequency Survey", "Last Survey Date"],
                [
                    "one",
                    "Mumbai-Pune Road Expansion",
                    "The Mumbai-Pune Road Expansion project focuses on widening and upgrading the expressway to improve connectivity and accommodate the increasing volume of vehicles. This includes constructing additional lanes, enhancing road safety features, and implementing modern infrastructure to reduce congestion and travel time for commuters and freight transport.",
                    "monthly",
                    "2024-05-15"
                ],
                [
                    "two",
                    "Allahabad-Haridwar Bridge Construction",
                    "This ambitious Allahabad-Haridwar Bridge Construction project involves building a state-of-the-art bridge over the Ganges River. The project aims to enhance transportation efficiency, provide a critical link for commuters and cargo, and alleviate the pressure on existing bridges. It also incorporates advanced engineering techniques to ensure durability and environmental sustainability.",
                    "quarterly",
                    "2024-07-01"
                ],
                [
                    "three",
                    "Kolkata-Siliguri Road Widening Project",
                    "The Kolkata-Siliguri Road Widening Project seeks to address the issue of traffic congestion along this crucial route. By expanding the road and redesigning the intersections, this project will create a smoother flow of vehicles, enhance accessibility for residents and businesses, and improve overall travel efficiency between the two cities.",
                    "yearly",
                    "2024-08-10"
                ],
                [
                    "four",
                    "Delhi-Jaipur Zebra Crossing Installation",
                    "This project aims to enhance pedestrian safety along the Delhi-Jaipur highway by installing clearly marked zebra crossings at key junctions. The initiative involves modern road markings, traffic signage, and public awareness campaigns to encourage road safety practices and ensure a secure environment for walkers in high-footfall areas.",
                    "quarterly",
                    "2024-09-10"
                ],
                [
                    "five",
                    "Bangalore-Chennai Traffic Signal Upgrade",
                    "The Bangalore-Chennai Traffic Signal Upgrade project focuses on modernizing and synchronizing traffic signals along this important corridor. This initiative aims to reduce traffic jams, improve travel time, and enhance road safety by incorporating advanced signal systems, real-time traffic monitoring, and adaptive signal technology.",
                    "yearly",
                    "2024-06-20"
                ]
            ],
            "RHS_chainage": chainage_values_RHS,
            "LHS_chainage": chainage_values_LHS,
            "RF_chainage": [row[0] for row in Road_furniture],
            "plantation": plantation,
            "Survey": {
                "survey1":{
                    "Road_Furniture": {
                        "one": {
                                "LHS": {
                                    "Road Furniture counts of different categories": {
                                        "pieChart": {
                                            "chartData":Pie_chart,
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
                                            "chartData": Road_furniture,
                                        }
                                    }
                                },
                                "RHS": {
                                    "Road Furniture counts of different categories": {
                                        "pieChart": {
                                            "chartData": Pie_chart,
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
                                            "chartData": Road_furniture,
                                        }
                                    }
                                }
                            }
                    },
                    "Street_Light": {
                        "one": {
                            "LHS": {
                                "Street Light counts of different categories": {
                                    "pieChart": {
                                        "chartData": Street_light_pie_chart,
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
                                "Distribution of street lights by chainage": {
                                    "doubleBarChart": {
                                        "chartData": Street_light
                                    }
                                },
                                
                            },
                            "RHS": {
                                "Road Furniture counts of different categories": {
                                    "pieChart": {
                                        "chartData": Street_light_pie_chart,
                                    },

                                    "barChart": {
                                        "chartData": [
                                            ["Double arm", "121"],
                                            ["Single arm", "80"],
                                            ["Solar", "35"],
                                            ["Solar powered", "10"],
                                            ["Solar signal", "41"],
                                        ]
                                    }
                                },
                                "Distribution of Road Furniture by chainage": {
                                    "doubleBarChart": {
                                        "chartData": Street_light
                                    }
                                }
                            }

                        }
                    },
                    "Pavement_Distress": {
                        "one": {
                            "RHS": {
                                "Cracking": {
                                    "chartData": RHScrack,

                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Cracking_severity-based.kml"
                                },
                                "Potholes": {
                                    "chartData": RHSpotholes,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Potholes_severity-based.kml"
                                },
                                "Patch Work": {
                                    "chartData": RHSpatchwork,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Patch_work_severity-based.kml"
                                },
                                "Alligator Crack": {
                                    "chartData": RHSalligator,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Alligator_crack.kml"
                                },
                                "Longitudinal": {
                                    "chartData": RHSlongitudinal,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Longitudinal_crack.kml"
                                },
                                "Transverse": {
                                    "chartData": RHStransverse,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Transverse_crack.kml"
                                },
                                "Edge Crack": {
                                    "chartData": RHSedgecrack,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Edge_crack_severity-based.kml"
                                },
                                "Bleeding": {
                                    "chartData": RHSbleeding,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Bleeding_severity-based.kml"
                                },
                                "Depression": {
                                    "chartData": RHSdepression,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Depression_severity-based.kml"
                                },
                                "Rutting": {
                                    "chartData": RHSrutting,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Rutting.kml"
                                },
                                "Shoving": {
                                    "chartData": RHSshoving,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Shoving_severity-based.kml"
                                }
                            },
                            "LHS": {
                                "Cracking": {
                                    "chartData": LHScrack,

                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Cracking_severity-based.kml"
                                },
                                "Potholes": {
                                    "chartData": LHSpotholes,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Potholes_severity-based.kml"
                                },
                                "Patch Work": {
                                    "chartData": LHSpatchwork,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Patch_work_severity-based.kml"
                                },
                                "Alligator Crack": {
                                    "chartData": LHSalligator,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Alligator_crack.kml"
                                },
                                "Longitudinal": {
                                    "chartData": LHSlongitudinal,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Longitudinal_crack.kml"
                                },
                                "Transverse": {
                                    "chartData": LHStransverse,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Transverse_crack.kml"
                                },
                                "Edge Crack": {
                                    "chartData": LHSedgecrack,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Edge_crack_severity-based.kml"
                                },
                                "Bleeding": {
                                    "chartData": LHSbleeding,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Bleeding_severity-based.kml"
                                },
                                "Depression": {
                                    "chartData": LHSdepression,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Depression_severity-based.kml"
                                },
                                "Rutting": {
                                    "chartData": LHSrutting,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Rutting.kml"
                                },
                                "Shoving": {
                                    "chartData": LHSshoving,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Shoving_severity-based.kml"
                                }
                            }
                        }
                    }
                    },
                "survey2":{
                    "Road_Furniture": {
                        "one": {
                                "LHS": {
                                    "Road Furniture counts of different categories": {
                                        "pieChart": {
                                            "chartData":Pie_chart,
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
                                            "chartData": Road_furniture,
                                        }
                                    }
                                },
                                "RHS": {
                                    "Road Furniture counts of different categories": {
                                        "pieChart": {
                                            "chartData": Pie_chart,
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
                                            "chartData": Road_furniture,
                                        }
                                    }
                                }
                            }
                    },
                    "Street_Light": {
                        "one": {
                            "LHS": {
                                "Street Light counts of different categories": {
                                    "pieChart": {
                                        "chartData": Street_light_pie_chart,
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
                                "Distribution of street lights by chainage": {
                                    "doubleBarChart": {
                                        "chartData": Street_light
                                    }
                                },
                                
                            },
                            "RHS": {
                                "Road Furniture counts of different categories": {
                                    "pieChart": {
                                        "chartData": Street_light_pie_chart,
                                    },

                                    "barChart": {
                                        "chartData": [
                                            ["Double arm", "121"],
                                            ["Single arm", "80"],
                                            ["Solar", "35"],
                                            ["Solar powered", "10"],
                                            ["Solar signal", "41"],
                                        ]
                                    }
                                },
                                "Distribution of Road Furniture by chainage": {
                                    "doubleBarChart": {
                                        "chartData": Street_light
                                    }
                                }
                            }

                        }
                    },
                    "Pavement_Distress": {
                        "one": {
                            "RHS": {
                                "Cracking": {
                                    "chartData": RHScrack,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Cracking_severity-based.kml"
                                },
                                "Potholes": {
                                    "chartData": RHSpotholes,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Potholes_severity-based.kml"
                                },
                                "Patch Work": {
                                    "chartData": RHSpatchwork,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Patch_work_severity-based.kml"
                                },
                                "Alligator Crack": {
                                    "chartData": RHSalligator,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Alligator_crack.kml"
                                },
                                "Longitudinal": {
                                    "chartData": RHSlongitudinal,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Longitudinal_crack.kml"
                                },
                                "Transverse": {
                                    "chartData": RHStransverse,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Transverse_crack.kml"
                                },
                                "Edge Crack": {
                                    "chartData": RHSedgecrack,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Edge_crack_severity-based.kml"
                                },
                                "Bleeding": {
                                    "chartData": RHSbleeding,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Bleeding_severity-based.kml"
                                },
                                "Depression": {
                                    "chartData": RHSdepression,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Depression_severity-based.kml"
                                },
                                "Rutting": {
                                    "chartData": RHSrutting,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Rutting.kml"
                                },
                                "Shoving": {
                                    "chartData": RHSshoving,
                                    "url": "http://127.0.0.1:8000//media/kml/RHS-20250208T155709Z-001/RHS/RHS_Shoving_severity-based.kml"
                                }
                            },
                            "LHS": {
                                "Cracking": {
                                    "chartData": LHScrack,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Cracking_severity-based.kml"
                                },
                                "Potholes": {
                                    "chartData": LHSpotholes,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Potholes_severity-based.kml"
                                },
                                "Patch Work": {
                                    "chartData": LHSpatchwork,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Patch_work_severity-based.kml"
                                },
                                "Alligator Crack": {
                                    "chartData": LHSalligator,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Alligator_crack.kml"
                                },
                                "Longitudinal": {
                                    "chartData": LHSlongitudinal,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Longitudinal_crack.kml"
                                },
                                "Transverse": {
                                    "chartData": LHStransverse,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Transverse_crack.kml"
                                },
                                "Edge Crack": {
                                    "chartData": LHSedgecrack,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Edge_crack_severity-based.kml"
                                },
                                "Bleeding": {
                                    "chartData": LHSbleeding,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Bleeding_severity-based.kml"
                                },
                                "Depression": {
                                    "chartData": LHSdepression,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Depression_severity-based.kml"
                                },
                                "Rutting": {
                                    "chartData": LHSrutting,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Rutting.kml"
                                },
                                "Shoving": {
                                    "chartData": LHSshoving,
                                    "url": "http://127.0.0.1:8000//media/kml/LHS-20250208T155709Z-001/LHS/LHS_Shoving_severity-based.kml"
                                }
                            }
                        }
                    }

                }   
            
            },
        }
        
from django.contrib.auth.hashers import make_password
try:
    if not User.objects.filter(username='admin').exists():
        dummy_user = User.objects.create(
            username='admin',
            email='student@example.com',
            password=make_password('admin')

        )
        
        admin_role, _ = Role.objects.get_or_create(name='admin')
        UserRole.objects.create(user=dummy_user, role=admin_role)

    
    user_roles = UserRole.objects.select_related('user', 'role').all()
    print("Dummy users created successfully.")
    # for ur in user_roles:
    #     print(f"Username: {ur.user.username}, Email: {ur.user.email}, Role: {ur.role.name}")

except Exception as e:
    print(f"⚠️ Error creating dummy user: {e}")

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class LoginView(APIView):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = User.objects.filter(username=username).first()
            if user and check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                user_serializer = UserSerializer(user)
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': user_serializer.data,
                    'data' : data
                }, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




# User.objects.all().delete()
# UserRole.objects.all().delete()
# Role.objects.all().delete()



class AdminLogin(APIView):
    serializer_class = LoginSerializer
    # print("got it")
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = User.objects.filter(username=username).first()
            
            if user and check_password(password, user.password):
                users = UserRole.objects.all().annotate(
                    userid=F('user__id'),
                    username=F('user__username'),
                    email=F('user__email'),
                    Urole=F('role__name')
                    ).values('userid','username', 'email', 'Urole')

                if UserRole.objects.filter(user=user, role__name='admin').exists():
                        user_serializer = UserSerializer(user)
                        refresh = RefreshToken.for_user(user)
                        return Response({
                            'users': users,
                            'access': str(refresh.access_token),
                            'refresh': str(refresh),
                            'user': user_serializer.data,
                })
            else:
                print("Invalid credentials")

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




class DeleteUser(APIView):
    permission_classes = [AllowAny]  # <- Important
    authentication_classes = []
    def delete(self, request, userid):
        try:
            user = User.objects.get(id=userid)

            # ✅ Now safe to delete
            UserRole.objects.get(user=user).delete()
            user.delete()
            for ur in UserRole.objects.all():
                print(f"Userid:{ur.user.id},Username: {ur.user.username}, Email: {ur.user.email}, Role: {ur.role.name}")

            # Updated user list
            users = UserRole.objects.all().annotate(
                userid=F('user__id'),
                username=F('user__username'),
                email=F('user__email'),
                Urole=F('role__name')
            ).values('userid','username', 'email', 'Urole')
            return Response({'users': users}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        


class ModifyUser(APIView):
    permission_classes = [AllowAny]  # <- Important
    authentication_classes = []  
    serializer_class = RegisterSerializer

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        role_name = request.data['role']

        
        if not username:
            return Response({'error': 'No username provided'}, status=400)

        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'error': 'User not found'}, status=404)

        if email:
            user.email = email
        if password:
            user.set_password(password)  # set_password handles hashing internally
        user.save()


        if role_name:
            userRole = UserRole.objects.filter(user__username=username).first()
            if userRole:
                role = Role.objects.filter(name=role_name).first()
                if not role:
                    return Response({'error': 'Role not found'}, status=status.HTTP_400_BAD_REQUEST)
                userRole.role = role
                userRole.save()
        users = UserRole.objects.all().annotate(
            userid=F('user__id'),
            username=F('user__username'),
            email=F('user__email'),
            Urole=F('role__name')
        ).values('userid','username', 'email', 'Urole')
        print(users)
        return Response({'users': users}, status=status.HTTP_200_OK)
            

            


class AddUser(APIView):
    permission_classes = [AllowAny]  # <- Important
    authentication_classes = []  
    serializer_class = RegisterSerializer
    
    def post(self, request):
        print("AddUser called with data:", request.data)
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        role_name = request.data['role']

        if not username or not email or not password or not role_name:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create(username=username, email=email, password=make_password(password))
            role,_ = Role.objects.get_or_create(name=role_name)
            UserRole.objects.create(user=user, role=role)

            # Updated user list
            users = UserRole.objects.all().annotate(
                userid=F('user__id'),
                username=F('user__username'),
                email=F('user__email'),
                Urole=F('role__name')
            ).values('userid','username', 'email', 'Urole')
            print(users)
            return Response({'users': users}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error  hhhh': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
    
    
