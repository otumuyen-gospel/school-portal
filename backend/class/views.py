from django.shortcuts import render
from rest_framework import status
from .models import Class
from .serializers import ClassSerializers
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET', 'POST'])
def class_list(request):
    if request.method == 'GET':
        classes = Class.objects.all()
        class_serializer = ClassSerializers(classes, many=True)
        return Response(class_serializer.data)
    elif request.method == 'POST':
        class_serializer = ClassSerializers(data=request.data)
        if class_serializer.is_valid():
            class_serializer.save()
            return Response(class_serializer.data,
                 status=status.HTTP_201_CREATED)
        return Response(class_serializer.errors,
                 status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def class_detail(request, pk):
    try:
         school_class = Class.objects.get(pk=pk)
    except Class.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        class_serializer = ClassSerializers(school_class)
        return Response(class_serializer.data)
    elif request.method == 'PUT':
        class_serializer = ClassSerializers(school_class, data=request.data)
        if class_serializer.is_valid():
            class_serializer.save()
            return Response(class_serializer.data)
        return Response(class_serializer.errors,
             status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        school_class.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)