
//Patrick Stumbaugh
/*compile by using command: rustc main.rs 
Then, execute using command: ./main num_partitions num_elements
Where num_partitions and num_elements are your choice
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

*/

use std::env; // to get arugments passed to the program
use std::thread; // for threads


//A single threaded map-reduce program
fn main() {

    // Use std::env to get arguments passed to the program
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        println!("ERROR: Usage {} num_partitions num_elements", args[0]);
        return;
    }
    //number of partitions to create:
    let num_partitions : usize = args[1].parse().unwrap();
    //number of elements total being used:
    let num_elements : usize = args[2].parse().unwrap();
    
    //if less than one partition, error:
    if num_partitions < 1{
      println!("ERROR: num_partitions must be at least 1");
        return;
    }
    
    //if there are more partitions then there are elements, error:
    if num_elements < num_partitions{
        println!("ERROR: num_elements cannot be smaller than num_partitions");
        return;
    }

    // Generate data to go in our partitions (saved as a vector)
    let v = generate_data(num_elements);

    // PARTITION STEP: partition the data into 2 partitions
    let xs = partition_data_in_two(&v);

    // Print info about the partitions
    print_partition_info(&xs);

    let mut intermediate_sums : Vec<usize> = Vec::new();


    //following code is an example of running two threads concurrently, 
    //manually coded to do so. 
    let xs_clone = xs.clone(); //using a clone for the first handle
    let part1 = thread::spawn(move ||map_data(&xs_clone[0]));
    let part2 = thread::spawn(move ||map_data(&xs[1]));
    
    //join/unwrap our threads
    let new1 = part1.join().unwrap();
    let new2 = part2.join().unwrap();
    
    //push our threads (already joined) to the intermediate_sums
    intermediate_sums.push(new1);
    intermediate_sums.push(new2);

    // Print the vector with the intermediate sums
    println!("Intermediate sums = {:?}", intermediate_sums);

    // REDUCE STEP: Process the intermediate result to produce the final result
    let sum = reduce_data(&intermediate_sums);
    println!("Sum = {}", sum);



    //following is an example of running an unknown amount of threads concurrently

    //variables:
    let mut intermediate_sums2 : Vec<usize> = Vec::new();//create a new vector to hold intermediate sums
    let mut part_counter = 0;//number of partitions we'll have to make individual threads for (used as a counter)
    let mut handles = Vec::new(); //create a new vector for handles (to hold our threads)
    
    
    //Calls partition_data to partition the data into equal partitions
    let partitioned_data = partition_data(num_partitions, &v);
    
    //Calls print_partition_info to print info on the partitions that have been created
    print_partition_info(&partitioned_data);

    //Creates one thread per partition and uses each thread to concurrently process one partition
    while part_counter != num_partitions {
        let part_clone = partitioned_data.clone(); //clone variable
        let new_part1 = thread::spawn(move ||map_data(&part_clone[part_counter])); //spawn a new thread
        handles.push(new_part1); //save new thread by pushing to handles vector
        part_counter = part_counter + 1;//increment counter
    }
    
    //Collects the intermediate sums from all the threads
    for child in handles {
        let adding_item = child.join().unwrap(); //join the return value for each item in handles vector of threads
        intermediate_sums2.push(adding_item); //push to the intermediate_sums2
    }
    
    //Prints information about the intermediate sums
    println!("Intermediate sums = {:?}", intermediate_sums2);

    //Calls reduce_data to process the intermediate sums
    let sum2 = reduce_data(&intermediate_sums2);
    
    //Prints the final sum computed by reduce_data
    println!("Sum = {}", sum2);
    
}


//*******FUNCTIONS**********

//Print the number of partitions and the size of each partition
fn print_partition_info(vs: &Vec<Vec<usize>>){
    println!("Number of partitions = {}", vs.len());
    for i in 0..vs.len(){
        println!("\tsize of partition {} = {}", i, vs[i].len());
    }
}

//Create a vector with integers from 0 to num_elements -1
fn generate_data(num_elements: usize) -> Vec<usize>{
    let mut v : Vec<usize> = Vec::new();
    for i in 0..num_elements {
        v.push(i);
    }
    return v;
}

//Partition the data in the vector v into 2 vectors

fn partition_data_in_two(v: &Vec<usize>) -> Vec<Vec<usize>>{
    let partition_size = v.len() / 2;
    // Create a vector that will contain vectors of integers
    let mut xs: Vec<Vec<usize>> = Vec::new();

    // Create the first vector of integers
    let mut x1 : Vec<usize> = Vec::new();
    // Add the first half of the integers in the input vector to x1
    for i in 0..partition_size{
        x1.push(v[i]);
    }
    // Add x1 to the vector that will be returned by this function
    xs.push(x1);

    // Create the second vector of integers
    let mut x2 : Vec<usize> = Vec::new();
    // Add the second half of the integers in the input vector to x2
    for i in partition_size..v.len(){
        x2.push(v[i]);
    }
    // Add x2 to the vector that will be returned by this function
    xs.push(x2);
    // Return the result vector
    xs
}

//Sum up the all the integers in the given vector

fn map_data(v: &Vec<usize>) -> usize{
    let mut sum = 0;
    for i in v{
        sum += i;
    }
    sum
}

//Sum up the all the integers in the given vector

fn reduce_data(v: &Vec<usize>) -> usize{
    let mut sum = 0;
    for i in v{
        sum += i;
    }
    sum
}


/* Partitions the data into a number of partitions such that
* - the returned partitions contain all elements that are in the input vector
* - if num_elements is a multiple of num_partitions, then all partitions must have equal number of elements
* - if num_elements is not a multiple of num_partitions, some partitions can have one more element than other partitions
*/
fn partition_data(num_partitions: usize, v: &Vec<usize>) -> Vec<Vec<usize>>{

    //size of each partition
    let part_size = v.len()/num_partitions;
    let mut leftovers = v.len()%num_partitions;

    //Vector of vectors of integers
    let mut array_vector: Vec<Vec<usize>> = Vec::new(); //create vector holding an array of vectors of integers
    let mut counter = 0; //holding item for data in v
    let mut looper = 0; //holding item for looping through number of partitions
    
    while looper != num_partitions {
        //create a temp vector to hold items
        let mut adding_vector : Vec<usize> = Vec::new();
        
        //loop through the param data, adding to our temp vector
        for _i in 0..part_size {
            adding_vector.push(v[counter]);
            counter = counter + 1; //increment counter
        }
        
        //add any leftovers if given
        if leftovers != 0 {
            adding_vector.push(v[counter]);
            counter = counter + 1; //increment counter
            leftovers = leftovers - 1; //decrement leftovers
        }
        
        //push our temp vector to the main vector 
        array_vector.push(adding_vector);
        
        //increment the looper
        looper = looper + 1;
    }
    
    return array_vector;
}

