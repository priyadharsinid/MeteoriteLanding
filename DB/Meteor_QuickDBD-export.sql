-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Meteorite Data" (
    "meteorite_name" object   NOT NULL,
    "id" int64   NOT NULL,
    "nametype" object   NOT NULL,
    "recclass" object   NOT NULL,
    "mass(g)" float64   NOT NULL,
    "fall" object   NOT NULL,
    "year" int64   NOT NULL,
    "reclat" float64   NOT NULL,
    "reclong" float64   NOT NULL,
    "GeoLocation" object   NOT NULL,
    CONSTRAINT "pk_Meteorite Data" PRIMARY KEY (
        "id"
     )
);

