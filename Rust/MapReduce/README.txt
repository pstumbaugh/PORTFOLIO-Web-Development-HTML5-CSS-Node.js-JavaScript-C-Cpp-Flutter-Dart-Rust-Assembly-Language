Patrick Stumbaugh

This program is an example of a single-threaded and multi-threaded Rust program. It mimics algorithms like MapReduce, as exaplained below:

MapReduce is a programming model and an associated implementation for processing and generating big data sets with a parallel, distributed algorithm on a cluster.
A MapReduce program is composed of a map procedure, which performs filtering and sorting (such as sorting students by first name into queues, one queue for each name), and a reduce method, which performs a summary operation (such as counting the number of students in each queue, yielding name frequencies).

The goal of this program was to learn many of the basics of Rust and how to execute it with multiple threads running concurrently. 

The program is split into two sections. The first section takes the data and splits it in two, then runs the algorithm and manually splits the results into two partitions, running each as a thread concurrently. 
The second part of the program takes the same data, but splits it into the user specified number of partitions. Then, these partitions will create just as many threads, running concurrently. 


-------------------
Compile by using command: rustc main.rs 

Then, execute using command: ./main num_partitions num_elements
Where num_partitions and num_elements are your choice. 

(ie): ./main 6 153
this will give you the result:

Number of partitions = 2                                                                                                                                                                                     
        size of partition 0 = 76                                                                                                                                                                             
        size of partition 1 = 77                                                                                                                                                                             
Intermediate sums = [2850, 8778]                                                                                                                                                                             
Sum = 11628                                                                                                                                                                                                  
Number of partitions = 6                                                                                                                                                                                     
        size of partition 0 = 26                                                                                                                                                                             
        size of partition 1 = 26                                                                                                                                                                             
        size of partition 2 = 26                                                                                                                                                                             
        size of partition 3 = 25                                                                                                                                                                             
        size of partition 4 = 25                                                                                                                                                                             
        size of partition 5 = 25                                                                                                                                                                             
Intermediate sums = [325, 1001, 1677, 2250, 2875, 3500]                                                                                                                                                      
Sum = 11628    
